import React, { useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import audioStore from '@/app/store/AudioStore'
import { Progress, Slider } from '@vkontakte/vkui' // Подставьте корректные импорты из вашего UI-фреймворка

const AudioPlayer: React.FC = observer(() => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isDragging, setIsDragging] = useState(false) // Состояние для отслеживания перетаскивания ползунка

  useEffect(() => {
    if (audioRef.current) {
      audioStore.setAudio(audioRef.current)
    }

    return () => {
      audioStore.removeAudio()
    }
  }, [])

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  const handleSliderChange = (value: number) => {
    if (!isDragging) {
      audioStore.setCurrentTime(value) // Устанавливаем текущее время только если не идет перетаскивание
    }
  }

  const handleSliderDragStart = () => {
    setIsDragging(true) // Устанавливаем флаг начала перетаскивания
  }

  const handleSliderDragEnd: React.DragEventHandler<HTMLDivElement> = event => {
    if (audioRef.current && event.currentTarget instanceof HTMLDivElement) {
      const rect = event.currentTarget.getBoundingClientRect()
      const offsetX = event.clientX - rect.left
      const percentage = offsetX / rect.width
      const newValue = percentage * audioStore.duration

      audioStore.setCurrentTime(newValue) // Устанавливаем текущее время по окончании перетаскивания
    }

    setIsDragging(false) // Сбрасываем флаг по окончании перетаскивания
  }

  return (
    <div>
      <audio ref={audioRef} />
      {audioStore.currentSong && (audioStore.isPlaying || !audioStore.isPlaying) && (
        <>
          <Slider
            value={audioStore.currentTime}
            min={0}
            max={audioStore.duration}
            onChange={handleSliderChange}
            onDragStart={handleSliderDragStart}
            onDragEnd={handleSliderDragEnd}
            style={{ width: '100%' }}
          />
        </>
      )}
      {audioStore.isLoading && <p>Loading...</p>}
      <p>
        {formatTime(audioStore.currentTime)} / {formatTime(audioStore.duration)}
      </p>
    </div>
  )
})

export default AudioPlayer
