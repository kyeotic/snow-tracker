export function onVisibilityChange(handler: () => void): () => void {
  let hidden: string
  let visibilityChange: string
  // @ts-ignore
  if (typeof document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden'
    visibilityChange = 'webkitvisibilitychange'
  } else {
    hidden = 'hidden'
    visibilityChange = 'visibilitychange'
  }
  window.document.addEventListener(visibilityChange, () => {
    // @ts-ignore
    if (document[hidden]) return
    handler()
  })
  return () => window.document.removeEventListener(visibilityChange, handler)
}
