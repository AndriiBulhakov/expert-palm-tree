import React, { forwardRef, useEffect, useRef } from "react"
import { useInView } from "react-intersection-observer"

type VideoProps = {
  src: string
  className?: string
  playOnce?: boolean
}

const Video = forwardRef<HTMLVideoElement, VideoProps>(function VideoComponent(
  { src, className, playOnce },
  ref
) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  })

  const setRefs = (node: HTMLVideoElement) => {
    if (ref) {
      if (typeof ref === "function") {
        ref(node)
      } else {
        ref.current = node
      }
    }
    inViewRef(node)
    videoRef.current = node
  }

  useEffect(() => {
    if (videoRef.current) {
      if (inView) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }
  }, [inView])

  return (
    <video
      ref={setRefs}
      src={src}
      className={className}
      {...(playOnce
        ? {
            onEnded: (e) => e.currentTarget.pause(),
          }
        : {
            loop: true,
          })}
      autoPlay
      muted
      playsInline
    />
  )
})

Video.displayName = "Video"

export default Video
