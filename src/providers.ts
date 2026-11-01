import type { Route } from './routeModel'
import { ROUTING_PROVIDER } from './routing'

export const OSM_COPYRIGHT_URL = 'https://www.openstreetmap.org/copyright'

export type LayerDefinition = {
  id: string
  label: string
  provider: string
  tiles: string
  attribution: string
  attributionUrl: string
  requiresKey?: boolean
}

export const layers: LayerDefinition[] = [
  {
    id: 'osm',
    label: 'OpenStreetMap Carto',
    provider: 'OpenStreetMap',
    tiles: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>',
    attributionUrl: OSM_COPYRIGHT_URL,
  },
  {
    id: 'opentopomap',
    label: 'OpenTopoMap',
    provider: 'OpenTopoMap',
    tiles: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution:
      'Kartendaten: &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>, SRTM | Kartendarstellung: &copy; <a href="https://opentopomap.org/about" target="_blank" rel="noopener noreferrer">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noopener noreferrer">CC-BY-SA</a>)',
    attributionUrl: 'https://opentopomap.org/about',
  },
]

export const GEOCODING_PROVIDER = {
  id: 'nominatim',
  label: 'Nominatim',
  url: 'https://operations.osmfoundation.org/policies/nominatim/',
} as const

export const LEAFLET_INFO = {
  id: 'leaflet',
  label: 'Leaflet',
  url: 'https://leafletjs.com/',
} as const

export const ALL_PROVIDER_ATTRIBUTIONS = [
  {
    name: 'OpenStreetMap',
    text: 'Kartendaten © OpenStreetMap-Mitwirkende, lizenziert unter der Open Database License (ODbL).',
    url: OSM_COPYRIGHT_URL,
  },
  {
    name: 'OpenTopoMap',
    text: 'Kartenstil © OpenTopoMap (CC-BY-SA 3.0), Daten © OpenStreetMap-Mitwirkende, SRTM.',
    url: 'https://opentopomap.org/about',
  },
  {
    name: 'Nominatim',
    text: 'Ortssuche über den öffentlichen Nominatim-Dienst der OpenStreetMap Foundation.',
    url: GEOCODING_PROVIDER.url,
  },
  {
    name: 'BRouter',
    text: 'Routenberechnung über die öffentliche BRouter-Instanz auf Basis von OpenStreetMap-Daten.',
    url: ROUTING_PROVIDER.attributionUrl,
  },
  {
    name: 'Leaflet',
    text: 'Kartendarstellung mit Leaflet, © Volodymyr Agafonkin und Mitwirkende (BSD-2-Clause).',
    url: LEAFLET_INFO.url,
  },
]

export type InspectorRouteStatus = {
  text: string
  tooltip: string
  isError?: boolean
}

export function getInspectorRouteStatus(route: Route | undefined): InspectorRouteStatus {
  if (!route) {
    return {
      text: 'Keine aktive Route',
      tooltip:
        'Keine Route zur Analyse ausgewählt. Wähle eine Route aus der Liste oder erstelle eine neue Route.',
    }
  }
  if (route.routingState === 'loading') {
    return {
      text: 'Route wird berechnet …',
      tooltip: `Routenverlauf wird über ${ROUTING_PROVIDER.label} berechnet.`,
    }
  }
  if (route.routingState === 'fallback') {
    return {
      text: 'Direkter Fallback',
      tooltip: `Automatisches Routing über ${ROUTING_PROVIDER.label} nicht möglich. Die Routenpunkte sind stattdessen direkt per Luftlinie verbunden.`,
      isError: true,
    }
  }
  if (route.nodes.length < 2) {
    return {
      text: 'Mindestens zwei Punkte erforderlich',
      tooltip:
        'Setze mindestens zwei Punkte auf der Karte, um eine Strecke und ein Höhenprofil zu berechnen.',
    }
  }
  if (route.routingState === 'idle') {
    return {
      text: 'Routing wird vorbereitet …',
      tooltip: 'Die Routenberechnung wird vorbereitet.',
    }
  }
  return {
    text: 'Routing aktiv',
    tooltip: `Route wurde erfolgreich über ${ROUTING_PROVIDER.label} berechnet und folgt Wegen und Pfaden.`,
  }
}

export type InspectorElevationStatus = {
  text: string
  tooltip: string
  active: boolean
}

export function getInspectorElevationStatus(
  route: Route | undefined,
  elevationCount: number,
): InspectorElevationStatus {
  if (!route) {
    return {
      text: 'Kein Höhenprofil',
      tooltip: 'Keine Route aktiv: Es ist kein Höhenprofil verfügbar.',
      active: false,
    }
  }
  if (elevationCount > 0) {
    return {
      text: 'Höhenprofil aktiv',
      tooltip:
        'Höhenprofil aktiv: Zeigt Höhenverlauf, Steigungen und Extremwerte entlang der aktiven Route.',
      active: true,
    }
  }
  return {
    text: 'Keine Höhendaten',
    tooltip: 'Für diese Route liegen keine Höhendaten vor.',
    active: false,
  }
}
