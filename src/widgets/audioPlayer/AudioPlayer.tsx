import React, { useEffect, useRef } from 'react'
import audioStore from '@/app/store/AudioStore'

const AudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (audioRef.current) {
      audioStore.setAudio(audioRef.current)
    }
  }, [])

  return <audio ref={audioRef} />
}

export default AudioPlayer
