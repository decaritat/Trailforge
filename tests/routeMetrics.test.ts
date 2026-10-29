import { describe, expect, it } from 'vitest'
import {
  getCumulativeDistances,
  getDisplayedRouteCoordinates,
  type Route,
} from '../src/routeModel'
import {
  formatDuration,
  getDistanceScale,
  getElevationScale,
  profileDetailsAtFraction,
  routeMetrics,
  selectedRoutePointDetails,
} from '../src/routeMetrics'

function createRoute(type: Route['type'] = 'hiking'): Route {
  return {
    id: 'route-1',
    name: 'Teststrecke',
    description: '',
    type,
    color: '#000000',
    editable: true,
    nodes: [
      { id: 'node-1', coordinate: [0, 0] },
      { id: 'node-2', coordinate: [0.02, 0] },
    ],
    geometry: [[0, 0], [0.01, 0], [0.02, 0]],
    elevations: [100, 150, 120],
  }
}

describe('route geometry and metrics', () => {
  it('uses the routed geometry and accumulates segment distances', () => {
    const route = createRoute()
    const coordinates = getDisplayedRouteCoordinates(route)
    const distances = getCumulativeDistances(coordinates)

    expect(coordinates).toEqual(route.geometry)
    expect(distances).toHaveLength(3)
    expect(distances[0]).toBe(0)
    expect(distances[1]).toBeCloseTo(1.1119, 3)
    expect(distances[2]).toBeCloseTo(distances[1] * 2, 3)
  })

  it('calculates ascent, descent, extrema, and hiking duration from route elevations', () => {
    const metrics = routeMetrics(createRoute())

    expect(metrics.ascent).toBe(50)
    expect(metrics.descent).toBe(30)
    expect(metrics.high).toBe(150)
    expect(metrics.low).toBe(100)
    expect(metrics.length).toBeCloseTo(2.2239, 3)
    expect(metrics.durationMinutes).toBe(35)
  })

  it('uses the cycling speed when estimating duration', () => {
    expect(routeMetrics(createRoute('cycling')).durationMinutes).toBe(14)
  })

  it('falls back to generated geometry and elevations when routed data is unavailable', () => {
    const route = createRoute()
    delete route.geometry
    delete route.elevations

    expect(getDisplayedRouteCoordinates(route)).toHaveLength(13)
    expect(routeMetrics(route).elevations).toHaveLength(13)
  })

  it('resolves profile fractions to the nearest sampled point and clamps the ends', () => {
    const route = createRoute()
    const midpoint = profileDetailsAtFraction(route, 0.5)

    expect(midpoint).toMatchObject({
      coordinate: [0.01, 0],
      elevation: 150,
      profileFraction: 0.5,
      elapsedMinutes: 20,
    })
    expect(profileDetailsAtFraction(route, -1)?.coordinate).toEqual([0, 0])
    expect(profileDetailsAtFraction(route, 2)?.coordinate).toEqual([0.02, 0])
    expect(profileDetailsAtFraction(route, Number.NaN)).toBeNull()
  })

  it('finds the profile location for a selected route waypoint', () => {
    const details = selectedRoutePointDetails(createRoute(), 'node-2')

    expect(details?.nodeIndex).toBe(1)
    expect(details?.coordinate).toEqual([0.02, 0])
    expect(selectedRoutePointDetails(createRoute(), 'missing')).toBeNull()
  })

  it('creates usable distance and elevation scales for zero and varied values', () => {
    expect(getDistanceScale(0)).toEqual({ max: 1, step: 1, ticks: [0, 1] })
    expect(getDistanceScale(10).ticks.at(-1)).toBe(10)
    expect(getElevationScale([])).toEqual({ min: 0, max: 50, step: 50 })
    expect(getElevationScale([101, 249])).toEqual({ min: 100, max: 250, step: 50 })
  })

  it('formats route durations in minutes or hours', () => {
    expect(formatDuration(45)).toBe('45 min')
    expect(formatDuration(125)).toBe('2 h 5 min')
  })
})
