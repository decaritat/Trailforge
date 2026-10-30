type PoiIconDefinition = {
  id: string
  label: string
  body: string
}

const stroke = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'

export const POI_ICON_CATEGORIES = [
  {
    id: 'water',
    label: 'Wasser',
    icons: [
      {
        id: 'drinking-water',
        label: 'Trinkwasser',
        body: `<path ${stroke} d="M4 8h11a3 3 0 0 1 3 3v2M4 8V5h8M8 5V3M18 13h3M18 13a3 3 0 1 1-3 3" />`,
      },
      {
        id: 'spring',
        label: 'Quelle',
        body: `<path ${stroke} d="M12 3s5 5.1 5 9a5 5 0 0 1-10 0c0-3.9 5-9 5-9Z" /><path ${stroke} d="M9 14c1.5 1.5 4.5 1.5 6 0" />`,
      },
      {
        id: 'lake',
        label: 'See',
        body: `<path ${stroke} d="M3 9c2.4-2 4.8 2 7.2 0s4.8-2 7.2 0 2.8 0 3.6-.6M3 14c2.4-2 4.8 2 7.2 0s4.8-2 7.2 0 2.8 0 3.6-.6M3 19c2.4-2 4.8 2 7.2 0s4.8-2 7.2 0 2.8 0 3.6-.6" />`,
      },
      {
        id: 'waterfall',
        label: 'Wasserfall',
        body: `<path ${stroke} d="M5 4v7M9 4v12M13 4v7M17 4v12M3 20h18" />`,
      },
    ],
  },
  {
    id: 'lodging',
    label: 'Unterkunft',
    icons: [
      {
        id: 'shelter',
        label: 'Schutzhütte',
        body: `<path ${stroke} d="m3 11 9-7 9 7v9H3zM8 20v-5h8v5M7 11h10" />`,
      },
      {
        id: 'camp',
        label: 'Camping',
        body: `<path ${stroke} d="m3 20 9-16 9 16M7 20l5-9 5 9M12 4v5" />`,
      },
      {
        id: 'hostel',
        label: 'Hostel',
        body: `<path ${stroke} d="M4 19V8h16v11M4 12h16M8 8V5h8v3M7 15h3M14 15h3" />`,
      },
      {
        id: 'hotel',
        label: 'Hotel',
        body: `<path ${stroke} d="M5 20V4h14v16M5 8h14M8 12h2M14 12h2M8 16h2M14 16h2M10 20v-2h4v2" />`,
      },
    ],
  },
  {
    id: 'info',
    label: 'Info',
    icons: [
      {
        id: 'flag',
        label: 'Markierung',
        body: `<path ${stroke} d="M6 21V4M6 5c4-3 7 3 12 0v8c-5 3-8-3-12 0" />`,
      },
      {
        id: 'summit',
        label: 'Gipfel',
        body: `<path ${stroke} d="m3 20 6.5-11 3 4L15 9l6 11M5 20h14" />`,
      },
      {
        id: 'viewpoint',
        label: 'Aussichtspunkt',
        body: `<path ${stroke} d="M3 9h5v6H3zM16 9h5v6h-5zM8 11h8M8 13h8M5.5 9V7M18.5 9V7" />`,
      },
      {
        id: 'picnic',
        label: 'Picknick',
        body: `<path ${stroke} d="M4 20h16M6 14h12M8 14l-2 6M16 14l2 6M12 14V5M7 5h10M9 5a3 3 0 0 1 6 0" />`,
      },
      {
        id: 'attraction',
        label: 'Sehenswürdigkeit',
        body: `<path ${stroke} d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" />`,
      },
      {
        id: 'museum',
        label: 'Museum',
        body: `<path ${stroke} d="m3 9 9-5 9 5M5 10v7M9 10v7M15 10v7M19 10v7M3 20h18M2 9h20" />`,
      },
    ],
  },
  {
    id: 'food',
    label: 'Essen und Trinken',
    icons: [
      {
        id: 'restaurant',
        label: 'Restaurant',
        body: `<path ${stroke} d="M5 3v7M3 3v4a2 2 0 0 0 4 0V3M5 10v11M15 3v18M15 3a4 4 0 0 1 0 8" />`,
      },
      {
        id: 'cafe',
        label: 'Café',
        body: `<path ${stroke} d="M5 8h12v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8ZM17 10h2a2 2 0 0 1 0 4h-2M3 20h16M8 4c0-1 1-1 1-2M12 4c0-1 1-1 1-2" />`,
      },
      {
        id: 'supermarket',
        label: 'Supermarkt',
        body: `<path ${stroke} d="M3 4h2l2 11h10l3-8H6M9 19a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM18 19a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />`,
      },
      {
        id: 'bakery',
        label: 'Bäckerei',
        body: `<path ${stroke} d="M4 12a8 8 0 0 1 16 0v7H4v-7ZM7 11a2 2 0 0 1 4 0M13 11a2 2 0 0 1 4 0M4 16h16" />`,
      },
    ],
  },
  {
    id: 'service',
    label: 'Service',
    icons: [
      {
        id: 'toilet',
        label: 'Toiletten',
        body: `<circle ${stroke} cx="8" cy="5" r="2" /><path ${stroke} d="M5 20v-7h6v7M3 13h10M16 3v7M13 10h6M16 10v10M13 20h6" />`,
      },
      {
        id: 'shower',
        label: 'Dusche',
        body: `<path ${stroke} d="M5 10a7 7 0 0 1 14 0M5 10h14M8 14v1M12 14v1M16 14v1M10 18v1M14 18v1" />`,
      },
      {
        id: 'atm',
        label: 'Geldautomat',
        body: `<rect ${stroke} x="4" y="3" width="16" height="18" rx="2" /><path ${stroke} d="M8 8h8M8 12h8M8 16h4" /><path ${stroke} d="M16 16h.01" />`,
      },
      {
        id: 'parking',
        label: 'Parkplatz',
        body: `<rect ${stroke} x="4" y="3" width="16" height="18" rx="2" /><path ${stroke} d="M10 17V7h3a3 3 0 0 1 0 6h-3" />`,
      },
    ],
  },
  {
    id: 'transport',
    label: 'Transport',
    icons: [
      {
        id: 'train',
        label: 'Bahnhof',
        body: `<rect ${stroke} x="5" y="3" width="14" height="14" rx="2" /><path ${stroke} d="M8 7h3M13 7h3M8 12h.01M16 12h.01M8 17l-3 4M16 17l3 4M8 17h8" />`,
      },
      {
        id: 'bus',
        label: 'Bushaltestelle',
        body: `<rect ${stroke} x="4" y="4" width="16" height="14" rx="3" /><path ${stroke} d="M4 10h16M8 18v3M16 18v3M8 7h8M8 14h.01M16 14h.01" />`,
      },
      {
        id: 'ferry',
        label: 'Fähre',
        body: `<path ${stroke} d="m3 16 3-8h12l3 8M3 16h18M5 20c2 2 4 2 6 0 2 2 4 2 6 0M9 8V5h6v3" />`,
      },
      {
        id: 'bike',
        label: 'Fahrrad',
        body: `<circle ${stroke} cx="6" cy="17" r="3" /><circle ${stroke} cx="18" cy="17" r="3" /><path ${stroke} d="M6 17 10 8h4l4 9M10 8l3 9M8 5h4" />`,
      },
    ],
  },
  {
    id: 'help',
    label: 'Hilfe',
    icons: [
      {
        id: 'information',
        label: 'Information',
        body: `<circle ${stroke} cx="12" cy="12" r="9" /><path ${stroke} d="M12 11v6M12 7h.01" />`,
      },
      {
        id: 'first-aid',
        label: 'Erste Hilfe',
        body: `<rect ${stroke} x="4" y="6" width="16" height="14" rx="2" /><path ${stroke} d="M9 6V4h6v2M8 13h8M12 9v8" />`,
      },
      {
        id: 'emergency',
        label: 'Notfall',
        body: `<path ${stroke} d="M12 3 2.8 20h18.4L12 3Z" /><path ${stroke} d="M12 9v5M12 17h.01" />`,
      },
      {
        id: 'pharmacy',
        label: 'Apotheke',
        body: `<path ${stroke} d="M12 3v18M3 12h18" /><circle ${stroke} cx="12" cy="12" r="8" />`,
      },
    ],
  },
] as const

const legacyIcons: readonly PoiIconDefinition[] = [
  {
    id: 'heart',
    label: 'Favorit',
    body: `<path fill="currentColor" d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z" />`,
  },
  {
    id: 'tree',
    label: 'Baum',
    body: `<path fill="currentColor" d="m12 3 5 7h-3l4 5h-4v6H10v-6H6l4-5H7l5-7Z" />`,
  },
  {
    id: 'forest',
    label: 'Wald',
    body: `<path fill="currentColor" d="m7 4 4 6H9l3 4H9v7H5v-7H2l3-4H3l4-6ZM17 3l4 6h-2l3 4h-3v8h-4v-8h-3l3-4h-2l4-6Z" />`,
  },
  {
    id: 'park',
    label: 'Park',
    body: `<circle fill="currentColor" cx="12" cy="9" r="6" /><path ${stroke} d="M12 15v6M7 21h10" />`,
  },
  {
    id: 'flower',
    label: 'Blume',
    body: `<circle fill="currentColor" cx="12" cy="12" r="2" /><circle fill="currentColor" cx="12" cy="6" r="3" /><circle fill="currentColor" cx="18" cy="12" r="3" /><circle fill="currentColor" cx="12" cy="18" r="3" /><circle fill="currentColor" cx="6" cy="12" r="3" />`,
  },
  {
    id: 'water',
    label: 'Wasser',
    body: `<path fill="currentColor" d="M12 3s6 6 6 11a6 6 0 1 1-12 0c0-5 6-11 6-11Z" />`,
  },
  {
    id: 'waterfall',
    label: 'Wasserfall',
    body: `<path ${stroke} d="M5 4v7M9 4v12M13 4v7M17 4v12M3 20h18" />`,
  },
  {
    id: 'market',
    label: 'Markt',
    body: `<path ${stroke} d="M4 10h16l-1 10H5L4 10ZM3 10l2-6h14l2 6M8 14h8" />`,
  },
  {
    id: 'shop',
    label: 'Geschäft',
    body: `<path ${stroke} d="M4 10h16l-1 10H5L4 10ZM3 10l2-6h14l2 6M8 14h8" />`,
  },
  {
    id: 'fire',
    label: 'Feuerstelle',
    body: `<path fill="currentColor" d="M12 3c2 4-1 5 2 8 1-2 2-2 2-5 3 3 4 6 2 10a6 6 0 0 1-12 0c0-3 2-5 4-7 0 3 1 4 2 5 2-4-1-6 0-11Z" />`,
  },
  {
    id: 'swimming',
    label: 'Schwimmen',
    body: `<path ${stroke} d="M3 10c2 2 4 2 6 0s4-2 6 0 4 2 6 0M3 16c2 2 4 2 6 0s4-2 6 0 4 2 6 0M7 6h10" />`,
  },
  {
    id: 'castle',
    label: 'Burg',
    body: `<path ${stroke} d="M4 20V8h3V5h3v3h4V5h3v3h3v12M2 20h20M8 20v-5h8v5" />`,
  },
  {
    id: 'church',
    label: 'Kirche',
    body: `<path ${stroke} d="M5 20V9l7-5 7 5v11M3 20h18M12 4V1M10 3h4M10 20v-5h4v5" />`,
  },
  {
    id: 'monument',
    label: 'Denkmal',
    body: `<path ${stroke} d="M12 3v13M8 20h8M6 16h12M9 3h6M7 7h10" />`,
  },
  {
    id: 'toilet',
    label: 'Toiletten',
    body: `<circle ${stroke} cx="8" cy="5" r="2" /><path ${stroke} d="M5 20v-7h6v7M3 13h10M16 3v7M13 10h6M16 10v10M13 20h6" />`,
  },
  {
    id: 'wifi',
    label: 'WLAN',
    body: `<path ${stroke} d="M3 9a14 14 0 0 1 18 0M6 13a9 9 0 0 1 12 0M9 17a4 4 0 0 1 6 0M12 21h.01" />`,
  },
  {
    id: 'accessibility',
    label: 'Barrierefrei',
    body: `<circle ${stroke} cx="12" cy="4" r="2" /><path ${stroke} d="M5 8h14M12 8v6l-4 7M12 14l5 4" />`,
  },
  {
    id: 'doctor',
    label: 'Arzt',
    body: `<circle ${stroke} cx="12" cy="12" r="9" /><path ${stroke} d="M12 7v10M7 12h10" />`,
  },
] as const

export type PoiIconId =
  | (typeof POI_ICON_CATEGORIES)[number]['icons'][number]['id']
  | (typeof legacyIcons)[number]['id']
export type PoiIcon = PoiIconDefinition & { id: PoiIconId }

export const defaultPoiIcon: PoiIconId = 'flag'

const categoryIcons: PoiIconDefinition[] = []
for (const category of POI_ICON_CATEGORIES) {
  categoryIcons.push(...category.icons)
}

const allIcons: readonly PoiIcon[] = [...categoryIcons, ...legacyIcons]

export function isPoiIconId(value: unknown): value is PoiIconId {
  return allIcons.some((icon) => icon.id === value)
}

export function getPoiIcon(value: unknown): PoiIcon {
  return allIcons.find((icon) => icon.id === value) ?? POI_ICON_CATEGORIES[0].icons[0]
}

export function poiIconSvg(icon: PoiIcon, className = 'poi-icon-graphic') {
  return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${icon.body}</svg>`
}
