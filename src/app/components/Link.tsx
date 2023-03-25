import { type ReactNode } from 'react'

export default function Link({ children, ...props }: { children: ReactNode }) {
  return (
    <a rel="noreferrer,nofollow" {...props}>
      {children}
    </a>
  )
}
