import { isTauri } from '@tauri-apps/api/core'
import { getVersion } from '@tauri-apps/api/app'
import { version as packageVersion } from '../package.json'

// VITE_APP_VERSION is set by the release workflow to the version of the Git tag
// and marks a release build. Other builds are development builds ("-dev").
export function formatAppVersion(baseVersion: string, releaseVersion?: string) {
  return releaseVersion?.trim() || `${baseVersion}-dev`
}

export async function getAppVersion() {
  const releaseVersion = import.meta.env.VITE_APP_VERSION as string | undefined
  const baseVersion = isTauri() ? await getVersion() : packageVersion
  return formatAppVersion(baseVersion, releaseVersion)
}
