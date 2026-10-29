import {
  getDisplayedRouteCoordinates,
  getDisplayedRouteElevations,
  type Coordinate,
  type MapPoint,
  type Route,
  type RouteNode,
} from './routeModel'

function uid(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`
}

export function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

export function toGpx(route: Route, points: MapPoint[]) {
  const routeCoordinates = getDisplayedRouteCoordinates(route)
  const elevations = getDisplayedRouteElevations(route)
  const track = routeCoordinates
    .map(
      ([lon, lat], index) =>
        `      <trkpt lat="${lat.toFixed(7)}" lon="${lon.toFixed(7)}"><ele>${elevations[index]}</ele></trkpt>`,
    )
    .join('\n')
  const waypoints = points
    .map(
      (point) =>
        `  <wpt lat="${point.coordinate[1].toFixed(7)}" lon="${point.coordinate[0].toFixed(7)}"><name>${escapeXml(
          point.name,
        )}</name><desc>${escapeXml(point.description)}</desc></wpt>`,
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Trailforge" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata><name>${escapeXml(route.name)}</name><desc>${escapeXml(route.description)}</desc></metadata>
${waypoints}
  <trk><name>${escapeXml(route.name)}</name><type>${route.type}</type><trkseg>
${track}
    </trkseg></trk>
</gpx>`
}

export function parseGpx(xml: string, editable: boolean): Route | null {
  const document = new DOMParser().parseFromString(xml, 'application/xml')
  if (document.querySelector('parsererror')) return null
  const points = Array.from(document.querySelectorAll('trkpt'))
  if (!points.length) return null
  const nodes: RouteNode[] = points.map((point) => ({
    id: uid('node'),
    coordinate: [
      Number(point.getAttribute('lon')),
      Number(point.getAttribute('lat')),
    ] as Coordinate,
  }))
  const elevations = points.map((point) => {
    const value = point.querySelector('ele')?.textContent?.trim()
    return value ? Number(value) : Number.NaN
  })
  const name =
    document.querySelector('metadata name, trk name')?.textContent?.trim() ||
    'Importierte GPX-Route'
  const description =
    document.querySelector('metadata desc')?.textContent?.trim() ||
    'Aus einer GPX-Datei importiert.'
  return {
    id: uid('route'),
    name,
    description,
    type: 'hiking',
    color: '#7ee787',
    editable,
    nodes,
    geometry: nodes.map((node) => node.coordinate),
    ...(elevations.every(Number.isFinite) ? { elevations } : {}),
    routingState: 'ready',
  }
}
