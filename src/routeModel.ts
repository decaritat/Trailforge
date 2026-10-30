export type RouteType = 'hiking' | 'cycling'
export type DistanceMarkerMode = 'auto' | 'manual'
export type Coordinate = [number, number]

export type RouteNode = {
  id: string
  coordinate: Coordinate
}

export type Route = {
  id: string
  name: string
  description: string
  type: RouteType
  color?: string
  customColor?: string
  editable: boolean
  nodes: RouteNode[]
  geometry?: Coordinate[]
  elevations?: number[]
  routingState?: 'idle' | 'loading' | 'ready' | 'fallback'
  routingError?: string
  showDistanceMarkers?: boolean
  distanceMarkerMode?: DistanceMarkerMode
  distanceMarkerStepKm?: number
}

export type ProfilePointDetails = {
  routeId: string
  profileFraction: number
  distance: number
  elevation: number
  elapsedMinutes: number
  coordinate: Coordinate
  nodeIndex?: number
}

export type MapPoint = {
  id: string
  name: string
  description: string
  coordinate: Coordinate
  source: 'manual' | 'poi'
}

export type ProjectFile = {
  version: 1
  name: string
  description: string
  routes: Route[]
  points: MapPoint[]
  activeRouteId: string
  mapLayerId: string
}

export function distanceKm(a: Coordinate, b: Coordinate) {
  const earthRadiusKm = 6371
  const lat1 = (a[1] * Math.PI) / 180
  const lat2 = (b[1] * Math.PI) / 180
  const dLat = ((b[1] - a[1]) * Math.PI) / 180
  const dLon = ((b[0] - a[0]) * Math.PI) / 180
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
}

export function elevationAt(coordinate: Coordinate) {
  const [lon, lat] = coordinate
  return Math.round(540 + Math.sin(lon * 18) * 34 + Math.cos(lat * 13) * 48)
}

export function getRouteCoordinates(route: Route): Coordinate[] {
  if (route.nodes.length < 2) return route.nodes.map((node) => node.coordinate)
  const coordinates: Coordinate[] = []
  for (let index = 0; index < route.nodes.length - 1; index += 1) {
    const from = route.nodes[index].coordinate
    const to = route.nodes[index + 1].coordinate
    const steps = 12
    for (let step = 0; step < steps; step += 1) {
      const fraction = step / steps
      coordinates.push([
        from[0] + (to[0] - from[0]) * fraction,
        from[1] + (to[1] - from[1]) * fraction,
      ])
    }
  }
  coordinates.push(route.nodes.at(-1)!.coordinate)
  return coordinates
}

export function getDisplayedRouteCoordinates(route: Route): Coordinate[] {
  return route.geometry?.length ? route.geometry : getRouteCoordinates(route)
}

export function getDisplayedRouteElevations(route: Route) {
  const coordinates = getDisplayedRouteCoordinates(route)
  if (
    route.elevations?.length === coordinates.length &&
    route.elevations.every(Number.isFinite)
  ) {
    return route.elevations
  }
  return coordinates.map(elevationAt)
}

export function getCumulativeDistances(coordinates: Coordinate[]) {
  const distances = [0]
  for (let index = 1; index < coordinates.length; index += 1) {
    distances.push(distances[index - 1] + distanceKm(coordinates[index - 1], coordinates[index]))
  }
  return distances
}
