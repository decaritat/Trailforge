import {
  distanceKm,
  elevationAt,
  getCumulativeDistances,
  getDisplayedRouteCoordinates,
  getDisplayedRouteElevations,
  type ProfilePointDetails,
  type Route,
} from './routeModel'

export function profileDetailsAtIndex(
  route: Route,
  profileIndex: number,
  nodeIndex?: number,
): ProfilePointDetails {
  const geometry = getDisplayedRouteCoordinates(route)
  const elevations = getDisplayedRouteElevations(route)
  const closestIndex = Math.min(Math.max(0, profileIndex), Math.max(0, geometry.length - 1))
  const coordinate = geometry[closestIndex] ?? route.nodes[0]?.coordinate ?? [0, 0]
  const distances = getCumulativeDistances(geometry)
  const distance = distances[closestIndex] ?? 0
  let ascent = 0
  for (let index = 1; index <= closestIndex; index += 1) {
    const elevationChange = elevations[index] - elevations[index - 1]
    if (elevationChange > 0) ascent += elevationChange
  }
  const speed = route.type === 'hiking' ? 4.5 : 15
  const totalDistance = distances.at(-1) ?? 0
  return {
    routeId: route.id,
    nodeIndex,
    profileFraction: distance / Math.max(1, totalDistance),
    distance,
    elevation: elevations[closestIndex] ?? elevationAt(coordinate),
    elapsedMinutes: Math.max(0, Math.round((distance / speed) * 60 + ascent / 10)),
    coordinate,
  }
}

export function profileDetailsAtFraction(route: Route, fraction: number): ProfilePointDetails | null {
  if (!Number.isFinite(fraction)) return null
  const geometry = getDisplayedRouteCoordinates(route)
  const distances = getCumulativeDistances(geometry)
  const targetDistance = Math.min(1, Math.max(0, fraction)) * (distances.at(-1) ?? 0)
  const profileIndex = distances.reduce(
    (closestIndex, distance, index) =>
      Math.abs(distance - targetDistance) < Math.abs(distances[closestIndex] - targetDistance)
        ? index
        : closestIndex,
    0,
  )
  return profileDetailsAtIndex(route, profileIndex)
}

export function selectedRoutePointDetails(route: Route, nodeId: string) {
  const nodeIndex = route.nodes.findIndex((node) => node.id === nodeId)
  if (nodeIndex < 0) return null
  const node = route.nodes[nodeIndex]
  const geometry = getDisplayedRouteCoordinates(route)
  let closestIndex = 0
  let closestDistance = Number.POSITIVE_INFINITY
  geometry.forEach((coordinate, index) => {
    const distance = distanceKm(coordinate, node.coordinate)
    if (distance < closestDistance) {
      closestDistance = distance
      closestIndex = index
    }
  })
  return profileDetailsAtIndex(route, closestIndex, nodeIndex)
}

export function routeMetrics(route: Route) {
  const coordinates = getDisplayedRouteCoordinates(route)
  const elevations = getDisplayedRouteElevations(route)
  const distances = getCumulativeDistances(coordinates)
  const length = distances.at(-1) ?? 0
  let ascent = 0
  let descent = 0
  for (let index = 1; index < coordinates.length; index += 1) {
    const change = elevations[index] - elevations[index - 1]
    if (change > 0) ascent += change
    if (change < 0) descent += Math.abs(change)
  }
  const speed = route.type === 'hiking' ? 4.5 : 15
  const durationMinutes = Math.max(1, Math.round((length / speed) * 60 + ascent / 10))
  return {
    length,
    ascent,
    descent,
    durationMinutes,
    high: elevations.length ? Math.max(...elevations) : 0,
    low: elevations.length ? Math.min(...elevations) : 0,
    elevations,
    distances,
  }
}

export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return hours ? `${hours} h ${rest} min` : `${rest} min`
}

export type ElevationScale = {
  min: number
  max: number
  step: number
}

export type DistanceScale = {
  max: number
  step: number
  ticks: number[]
}

export function getDistanceScale(distance: number): DistanceScale {
  const max = Math.max(0, distance)
  if (max === 0) return { max: 1, step: 1, ticks: [0, 1] }
  const targetStep = max / 5
  const magnitude = 10 ** Math.floor(Math.log10(targetStep))
  const normalizedStep = targetStep / magnitude
  const step =
    (normalizedStep <= 1.5 ? 1 : normalizedStep <= 3 ? 2 : normalizedStep <= 7 ? 5 : 10) *
    magnitude
  const ticks = [0]
  for (let value = step; value < max - step * 0.01; value += step) {
    ticks.push(Number(value.toFixed(6)))
  }
  if (ticks.at(-1) !== max) ticks.push(max)
  return { max, step, ticks }
}

export function formatDistanceAxis(distance: number) {
  return distance >= 100 ? distance.toFixed(0) : distance.toFixed(1).replace(/\.0$/, '')
}

export function getElevationScale(elevations: number[]): ElevationScale {
  if (!elevations.length) return { min: 0, max: 50, step: 50 }
  const minimum = Math.min(...elevations)
  const maximum = Math.max(...elevations)
  const range = Math.max(50, maximum - minimum)
  const step = Math.max(50, Math.ceil(range / 4 / 50) * 50)
  const min = Math.floor(minimum / step) * step
  const max = Math.max(min + step, Math.ceil(maximum / step) * step)
  return { min, max, step }
}
