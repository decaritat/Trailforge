import { describe, expect, it } from 'vitest'
import { initialProject, normalizeProject, readInitialProject, supportedLayerId } from '../src/project'

describe('project normalization', () => {
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
