import { useEffect, useMemo, useRef, useState } from 'react'
import { PauseIcon, PlayIcon } from '@heroicons/react/24/outline'

interface Props {
  url: string
  title?: string
}

export const AudioPlayer = ({ title, url }: Props) => {
  const [trackProgress, setTrackProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const audioRef = useRef(new Audio(url))
  const intervalRef = useRef<null | NodeJS.Timeout>(null)
  const isReady = useRef(false)

  // Destructure for conciseness
  const { duration, currentTime } = audioRef.current

  const durationStr = useMemo(() => {
    const pad = (n: any) => (isNaN(n) ? '00' : n < 10 ? `0${n}` : n)

    const convertToMinute = (time: number) => pad(Math.floor(time / 60))
    const convertToSecond = (time: number) => pad(Math.floor(time % 60))

    const currentStr = `${convertToMinute(currentTime)}:${convertToSecond(currentTime)}`
    const durationStr = `${convertToMinute(duration)}:${convertToSecond(duration)}`

    return `${currentStr}/${durationStr}`
  }, [currentTime, duration])

  useEffect(() => {
    audioRef.current.pause()

    audioRef.current = new Audio(url)
    setTrackProgress(audioRef.current.currentTime)

    if (isReady.current) {
      audioRef.current.play()
      setIsPlaying(true)
      startTimer()
    } else {
      // Set the isReady ref as true for the next pass
      isReady.current = true
    }
    return () => {
      audioRef.current.pause()
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [url])

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play()
      startTimer()
    } else {
      audioRef.current.pause()
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying])

  const startTimer = () => {
    // Clear any timers already running
    if (intervalRef.current) clearInterval(intervalRef.current)

    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        //
      } else {
        setTrackProgress(audioRef.current.currentTime)
      }
    }, 1000)
  }

  const onPause = () => setIsPlaying(false)

  const onResume = () => setIsPlaying(true)

  const onSeek = (value: string) => {
    if (intervalRef.current) clearInterval(intervalRef.current)

    audioRef.current.currentTime = parseFloat(value)
    setTrackProgress(audioRef.current.currentTime)
  }

  const onRangeEvent = (_event: any) => {
    if (!isPlaying) {
      setIsPlaying(true)
    }
    startTimer()
  }

  return (
    <div className="card px-4 py-4">
      {title && <div className="text-title-color mb-1">{title}</div>}
      <div
        className="flex gap-2 items-center"
        style={{ ['--player-range-progress' as any]: `${(currentTime / duration) * 100}%` }}
      >
        {isPlaying ? (
          <button type="button" className="pause" onClick={onPause} aria-label="일시정지">
            <PauseIcon className="w-5 l-5" />
          </button>
        ) : (
          <button type="button" className="play" onClick={onResume} aria-label="재생">
            <PlayIcon className="w-5 h-5" />
          </button>
        )}
        <div className="font-mono">{durationStr}</div>
        <input
          type="range"
          value={trackProgress}
          step="1"
          min="0"
          max={duration ? duration : `${duration}`}
          className="flex-grow player"
          onChange={(e) => onSeek(e.target.value)}
          onMouseUp={onRangeEvent}
          onKeyUp={onRangeEvent}
        />
      </div>
    </div>
  )
}
