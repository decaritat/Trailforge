import type { MouseEvent, ReactNode } from 'react'
import { isTauri } from '@tauri-apps/api/core'
import { openExternalUrl } from './externalUrl'

export function ExternalLink({
  url,
  children,
  className,
  title,
  tabIndex,
}: {
  url: string
  children: ReactNode
  className?: string
  title?: string
  tabIndex?: number
}) {
  const open = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isTauri()) return
    event.preventDefault()
    openExternalUrl(url)
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      title={title}
      tabIndex={tabIndex}
      onClick={open}
    >
      {children}
    </a>
  )
}
