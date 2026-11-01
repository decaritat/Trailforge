import { describe, expect, it } from 'vitest'
import { initialProject, normalizeProject, readInitialProject, supportedLayerId } from '../src/project'

describe('project normalization', () => {
  it('starts a new project with one empty editable route', () => {
    expect(initialProject.routes).toHaveLength(1)
    expect(initialProject.routes[0]).toMatchObject({
      id: initialProject.activeRouteId,
      type: 'hiking',
      editable: true,
      nodes: [],
    })
    expect(initialProject.routes[0].color).toBeUndefined()
  })

  it('preserves project data and restores a supported map layer', () => {
    const project = {
      ...initialProject,
      name: 'Meine Tour',
      mapLayerId: 'opentopomap',
      routes: [{ id: 'route-1' }],
    }

    expect(normalizeProject(project)).toEqual(project)
  })

  it('falls back to OpenStreetMap for unknown or absent map layers', () => {
    expect(supportedLayerId('retired-layer')).toBe('osm')
    expect(normalizeProject({ ...initialProject, mapLayerId: undefined }).mapLayerId).toBe('osm')
  })

  it('adds an empty description when opening an older project file', () => {
    const { description: _description, ...olderProject } = initialProject
    expect(normalizeProject(olderProject).description).toBe('')
  })

  it('limits imported project and route descriptions to 180 characters', () => {
    const project = normalizeProject({
      ...initialProject,
      description: 'p'.repeat(200),
      routes: [{ id: 'route-1', description: 'r'.repeat(200) }],
    })

    expect(project.description).toHaveLength(180)
    expect(project.routes[0].description).toHaveLength(180)
  })

  it('persists read-only route state and GPX timestamps through project normalization', () => {
    const project = normalizeProject({
      ...initialProject,
      routes: [
        {
          ...initialProject.routes[0],
          editable: false,
          gpxType: 'cycling',
          timestamps: ['2025-05-01T10:00:00Z', '2025-05-01T11:00:00Z'],
        },
      ],
      points: [
        {
          id: 'gpx-point-1',
          name: 'GPX-Wegpunkt',
          description: '',
          coordinate: [13, 52],
          source: 'poi',
          editable: false,
        },
      ],
    })

    const restored = normalizeProject(JSON.parse(JSON.stringify(project)))
    expect(restored.routes[0].editable).toBe(false)
    expect(restored.routes[0].gpxType).toBe('cycling')
    expect(restored.routes[0].timestamps).toEqual(project.routes[0].timestamps)
    expect(restored.points[0].editable).toBe(false)
  })

  it('adds a default icon to legacy points and preserves selected icons', () => {
    const project = normalizeProject({
      ...initialProject,
      points: [
        {
          id: 'point-1',
          name: 'Alter Punkt',
          description: '',
          coordinate: [13, 52],
          source: 'manual',
        },
        {
          id: 'point-2',
          name: 'Gipfel',
          description: '',
          coordinate: [13.1, 52.1],
          source: 'poi',
          icon: 'summit',
        },
      ],
    })

    expect(project.points[0].icon).toBe('flag')
    expect(project.points[1].icon).toBe('summit')
  })

  it('rejects values that do not contain route and point arrays', () => {
    expect(() => normalizeProject(null)).toThrow('Ungültiges Projekt')
    expect(() => normalizeProject({ routes: {}, points: [] })).toThrow('Ungültiges Projekt')
    expect(() => normalizeProject({ routes: [], points: null })).toThrow('Ungültiges Projekt')
  })

  it('loads the initial project when storage is empty, invalid, or malformed', () => {
    expect(readInitialProject({ getItem: () => null })).toBe(initialProject)
    expect(readInitialProject({ getItem: () => '{' })).toBe(initialProject)
    expect(
      readInitialProject({ getItem: () => JSON.stringify({ ...initialProject, mapLayerId: 'old' }) })
        .mapLayerId,
    ).toBe('osm')
  })
})
