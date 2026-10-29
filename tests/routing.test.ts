import { afterEach, describe, expect, it, vi } from 'vitest'
import { requestRouteGeometry, routingProfileLabel } from '../src/routing'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('BRouter integration', () => {
  it('selects and labels the route-specific profiles', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      {
        ok: true,
        json: async () => ({
          features: [{ geometry: { type: 'LineString', coordinates: [[13.4, 52.5, 35], [13.5, 52.6, 40]] } }],
        }),
      },
    )
    vi.stubGlobal('fetch', fetchMock)

    await requestRouteGeometry('hiking', [[13.4, 52.5], [13.5, 52.6]], new AbortController().signal)
    await requestRouteGeometry('cycling', [[13.4, 52.5], [13.5, 52.6]], new AbortController().signal)

    expect(new URL(fetchMock.mock.calls[0][0] as string).searchParams.get('profile')).toBe('hiking-beta')
    expect(new URL(fetchMock.mock.calls[1][0] as string).searchParams.get('profile')).toBe('trekking')
    expect(routingProfileLabel('hiking')).toContain('Wandern')
    expect(routingProfileLabel('cycling')).toContain('Radfahren')
  })

  it('rejects requests with fewer than two waypoints before fetching', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    await expect(requestRouteGeometry('hiking', [[13.4, 52.5]], new AbortController().signal))
      .rejects.toThrow('Mindestens zwei Routenpunkte erforderlich')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('normalizes valid route coordinates and includes elevations only when complete', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        {
          ok: true,
          json: async () => ({
            features: [{
              geometry: {
                coordinates: [[13.4, 52.5, 35], [Number.NaN, 52.6, 40], [13.5, 52.6, 42]],
              },
            }],
          }),
        },
      ),
    )

    await expect(
      requestRouteGeometry('hiking', [[13.4, 52.5], [13.5, 52.6]], new AbortController().signal),
    ).resolves.toEqual({
      coordinates: [[13.4, 52.5], [13.5, 52.6]],
      elevations: [35, 42],
    })
  })

  it('surfaces provider and invalid-response errors', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        text: async () => 'provider down',
      }),
    )
    await expect(
      requestRouteGeometry('cycling', [[13.4, 52.5], [13.5, 52.6]], new AbortController().signal),
    ).rejects.toThrow('BRouter HTTP 503: provider down')

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => {
          throw new SyntaxError('invalid JSON')
        },
      }),
    )
    await expect(
      requestRouteGeometry('cycling', [[13.4, 52.5], [13.5, 52.6]], new AbortController().signal),
    ).rejects.toThrow('BRouter hat keine gültige Routingantwort geliefert')
  })
})
