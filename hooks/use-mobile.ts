import * as React from "react"

const MOBILE_BREAKPOINT = 768
//this is to detect if the user is on a mobile device, we use a media query to check if the screen width is less than the mobile breakpoint. 
// We also listen for changes to the media query so that we can update the state when the user resizes their window.

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
