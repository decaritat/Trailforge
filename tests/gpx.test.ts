import { describe, expect, it } from 'vitest'
import { parseGpx, toGpx } from '../src/gpx'
import type { MapPoint, Route } from '../src/routeModel'

const route: Route = {
  id: 'route-1',
  name: 'Wald & Fluss',
  description: 'Eine <schöne> "Tour" & mehr',
  type: 'cycling',
  color: '#123456',
  editable: true,
  nodes: [
    { id: 'node-1', coordinate: [13.4, 52.5] },
    { id: 'node-2', coordinate: [13.41, 52.51] },
  ],
  geometry: [[13.4, 52.5], [13.41, 52.51]],
  elevations: [34, 41],
}

const points: MapPoint[] = [
  {
    id: 'point-1',
    name: 'Quelle & Rastplatz',
    description: 'Wasser <hier>',
    coordinate: [13.405, 52.505],
    source: 'manual',
  },
]

describe('GPX import and export', () => {
  it('exports route metadata, coordinates, elevations, and escaped waypoints', () => {
    const document = new DOMParser().parseFromString(toGpx(route, points), 'application/xml')

    expect(document.querySelector('parsererror')).toBeNull()
    expect(document.querySelector('metadata name')?.textContent).toBe(route.name)
    expect(document.querySelector('metadata desc')?.textContent).toBe(route.description)
    expect(document.querySelector('trk type')?.textContent).toBe('cycling')
    expect(document.querySelectorAll('trkpt')).toHaveLength(2)
    expect(document.querySelector('trkpt ele')?.textContent).toBe('34')
    expect(document.querySelector('wpt name')?.textContent).toBe(points[0].name)
    expect(document.querySelector('wpt desc')?.textContent).toBe(points[0].description)
  })

  it('imports route metadata, coordinates, and elevations with the requested editability', () => {
    const imported = parseGpx(toGpx(route, []), false)

    expect(imported).not.toBeNull()
    expect(imported).toMatchObject({
      name: route.name,
      description: route.description,
      type: 'hiking',
      editable: false,
      geometry: route.geometry,
      elevations: route.elevations,
      routingState: 'ready',
    })
  })

  it('uses metadata defaults and omits incomplete elevation data', () => {
    const imported = parseGpx(
      '<gpx><trk><trkseg><trkpt lat="52.5" lon="13.4"><ele>10</ele></trkpt><trkpt lat="52.6" lon="13.5"/></trkseg></trk></gpx>',
      true,
    )

    expect(imported).toMatchObject({
      name: 'Importierte GPX-Route',
      description: 'Aus einer GPX-Datei importiert.',
      editable: true,
    })
    expect(imported?.elevations).toBeUndefined()
    expect(imported?.nodes[0].coordinate).toEqual([13.4, 52.5])
  })

  it('rejects malformed GPX and documents without track points', () => {
    expect(parseGpx('<gpx><broken></gpx>', false)).toBeNull()
    expect(parseGpx('<gpx><metadata><name>Kein Track</name></metadata></gpx>', false)).toBeNull()
  })
})
