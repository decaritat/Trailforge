export type RouteType = 'hiking' | 'cycling'
export type Coordinate = [number, number]
export type RoutingProfile = 'trekking' | 'hiking-beta'
export type RouteGeometry = {
  coordinates: Coordinate[]
  elevations?: number[]
}

export const ROUTING_PROVIDER = {
  id: 'brouter',
  label: 'BRouter',
  endpoint: 'https://brouter.de/brouter',
  profiles: {
    hiking: 'hiking-beta',
    cycling: 'trekking',
  } satisfies Record<RouteType, RoutingProfile>,
} as const

type BRouterResponse = {
  features?: Array<{
    geometry?: {
      type?: string
      coordinates?: Array<number[]>
    }
  }>
}

function routeProfileFor(routeType: RouteType): RoutingProfile {
  return ROUTING_PROVIDER.profiles[routeType]
}

export function routingProfileLabel(routeType: RouteType) {
  return routeProfileFor(routeType) === 'hiking-beta'
    ? 'Wandern (hiking-beta)'
    : 'Radfahren (trekking)'
}

export async function requestRouteGeometry(
  routeType: RouteType,
  coordinates: readonly Coordinate[],
  signal: AbortSignal,
): Promise<RouteGeometry> {
  if (coordinates.length < 2) throw new Error('Mindestens zwei Routenpunkte erforderlich')

  const params = new URLSearchParams({
    lonlats: coordinates.map(([longitude, latitude]) => `${longitude},${latitude}`).join('|'),
    profile: routeProfileFor(routeType),
    alternativeidx: '0',
    format: 'geojson',
  })
  const response = await fetch(`${ROUTING_PROVIDER.endpoint}?${params.toString()}`, {
    signal,
  })

  if (!response.ok) {
    const message = (await response.text()).trim()
    throw new Error(
      `${ROUTING_PROVIDER.label} HTTP ${response.status}${message ? `: ${message.slice(0, 160)}` : ''}`,
    )
  }

  let payload: BRouterResponse
  try {
    payload = (await response.json()) as BRouterResponse
  } catch {
    throw new Error('BRouter hat keine gültige Routingantwort geliefert')
  }

  const rawCoordinates = payload.features?.[0]?.geometry?.coordinates
  const validCoordinates = rawCoordinates
    ?.filter(
      (coordinate) =>
        Number.isFinite(coordinate[0]) && Number.isFinite(coordinate[1]),
    )
  const geometry = validCoordinates?.map(
    ([longitude, latitude]) => [longitude, latitude] as Coordinate,
  )

  if (!geometry?.length) throw new Error('BRouter hat keine Route gefunden')
  const elevations = validCoordinates?.map((coordinate) => coordinate[2])
  return {
    coordinates: geometry,
    ...(elevations?.every((elevation): elevation is number => Number.isFinite(elevation))
      ? { elevations }
      : {}),
  }
}
