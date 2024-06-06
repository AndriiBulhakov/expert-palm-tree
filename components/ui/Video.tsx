import React, { forwardRef, useEffect, useRef, useState } from "react"
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
  const [poster, setPoster] = useState<string | undefined>(undefined)
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  })

  const setRefs = (node: HTMLVideoElement | null) => {
    if (ref) {
      if (typeof ref === "function") {
        ref(node)
      } else {
        ;(ref as React.MutableRefObject<HTMLVideoElement | null>).current = node
      }
    }
    inViewRef(node)
    videoRef.current = node
  }

  useEffect(() => {
    const captureFrame = () => {
      const video = videoRef.current
      if (video) {
        const canvas = document.createElement("canvas")
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const dataURL = canvas.toDataURL("image/jpeg")
          setPoster(dataURL)
        }
      }
    }

    if (videoRef.current) {
      videoRef.current.addEventListener("loadeddata", captureFrame, {
        once: true,
      })
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("loadeddata", captureFrame)
      }
    }
  }, [])

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
      poster={poster} // Set the captured poster
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
