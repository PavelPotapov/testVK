import React, { useEffect, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import audioStore from '@/app/store/AudioStore'

const AudioPlayer: React.FC = observer(() => {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (audioRef.current) {
      audioStore.setAudio(audioRef.current)
    }

    // Очистка слушателей при размонтировании
    return () => {
      if (audioRef.current) {
        audioStore.removeAudio() // Добавляем метод для удаления аудио элемента из хранилища
      }
    }
  }, [])

  return <audio ref={audioRef} />
})

export default AudioPlayer
