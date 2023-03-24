import { useCallback } from 'react'
import { useNavigate } from '@remix-run/react'

/**
 * Trigger a revalidation of the current routes loaders.
 *
 * This work by navigating to the current page, this make Remix run the loaders
 * of the current page again.
 *
 * The hook sets `replace: true` to the navigation options in order to avoid
 * adding new history entries, this will avoid a case when the user clicks on
 * the back button and it remains on the same page instead of going to the real
 * previous page.
 * @example
 * let revalidate = useRefresh();
 * return <button type="button" onClick={() => revalidate}>Reload</button>;
 */
export function useRefresh() {
  let navigate = useNavigate()
  return useCallback(() => {
    console.log('refreshing')
    navigate('.', { replace: true })
  }, [navigate])
}
