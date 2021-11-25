export default function Link({ children, ...props }) {
  return (
    <a rel="noreferrer,nofollow" {...props}>
      {children}
    </a>
  )
}
