import { useEffect, useRef, MutableRefObject } from "react"

function useMultipleRefs<T>(): [
  MutableRefObject<(T | null)[]>,
  (index: number) => (element: T | null) => void
] {
  const refs = useRef<(T | null)[]>([])

  const setRef = (index: number) => (element: T | null) => {
    refs.current[index] = element
  }

  return [refs, setRef]
}

export default useMultipleRefs
