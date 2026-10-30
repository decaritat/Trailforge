import type { ProjectFile, Route } from './routeModel'

const initialRoute: Route = {
  id: 'route-1',
  name: 'Neue 1. Route',
  description: '',
  type: 'hiking',
  editable: true,
  nodes: [],
  showDistanceMarkers: false,
  distanceMarkerMode: 'auto',
  distanceMarkerStepKm: 1,
}

export const initialProject: ProjectFile = {
  version: 1,
  name: 'Mein Outdoor-Projekt',
  description: '',
  routes: [initialRoute],
  points: [],
  activeRouteId: initialRoute.id,
  mapLayerId: 'osm',
}

const supportedLayerIds = new Set(['osm', 'opentopomap'])

export function supportedLayerId(layerId: unknown): string {
  return typeof layerId === 'string' && supportedLayerIds.has(layerId) ? layerId : 'osm'
}

export function normalizeProject(value: unknown): ProjectFile {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('routes' in value) ||
    !Array.isArray(value.routes) ||
    !('points' in value) ||
    !Array.isArray(value.points)
  ) {
    throw new Error('Ungültiges Projekt')
  }
  return {
    ...value,
    description:
      'description' in value && typeof value.description === 'string'
        ? value.description.slice(0, 180)
        : '',
    routes: value.routes.map((route) =>
      typeof route === 'object' &&
      route !== null &&
      'description' in route &&
      typeof route.description === 'string'
        ? { ...route, description: route.description.slice(0, 180) }
        : route,
    ),
    mapLayerId: supportedLayerId('mapLayerId' in value ? value.mapLayerId : undefined),
  } as ProjectFile
}

export function readInitialProject(storage: Pick<Storage, 'getItem'> = localStorage): ProjectFile {
  try {
    const saved = storage.getItem('trailforge-project')
    if (!saved) return initialProject
    return normalizeProject(JSON.parse(saved))
  } catch {
    return initialProject
  }
}
