import { ComponentChildren } from 'preact'

export default function Link({ children, ...props }: { children: ComponentChildren } & any) {
  return (
    <a rel='noreferrer,nofollow' {...props}>
      {children}
    </a>
  )
}
