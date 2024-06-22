import React, { useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import audioStore from '@/app/store/AudioStore'
import { Slider } from '@vkontakte/vkui' // Подставьте корректные импорты из вашего UI-фреймворка

const AudioPlayer: React.FC = observer(() => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)

  useEffect(() => {
    if (audioRef.current) {
      audioStore.setAudio(audioRef.current)
    }

    return () => {
      audioStore.removeAudio()
      cleanupAudioContext()
    }
  }, [])

  useEffect(() => {
    if (audioRef.current && audioStore.audioFileUrl) {
      changeAudioSource(audioStore.audioFileUrl)
    }
  }, [audioStore.audioFileUrl])

  const cleanupAudioContext = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(error => {
        console.error('Failed to close AudioContext:', error)
      })
      audioContextRef.current = null
      sourceRef.current = null
      analyserRef.current = null
    }
  }

  const setupVisualizer = () => {
    try {
      if (audioRef.current && canvasRef.current) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext
        audioContextRef.current = new AudioContext()
        const audioContext = audioContextRef.current

        sourceRef.current = audioContext.createMediaElementSource(audioRef.current)
        analyserRef.current = audioContext.createAnalyser()

        sourceRef.current.connect(analyserRef.current)
        analyserRef.current.connect(audioContext.destination)

        analyserRef.current.fftSize = 256
        const bufferLength = analyserRef.current.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)

        const canvas = canvasRef.current
        const canvasCtx = canvas.getContext('2d')
        if (!canvasCtx) {
          console.error('Failed to get canvas context')
          return
        }

        const WIDTH = canvas.width
        const HEIGHT = canvas.height

        const draw = () => {
          requestAnimationFrame(draw)

          if (analyserRef.current) analyserRef.current.getByteFrequencyData(dataArray)

          canvasCtx.clearRect(0, 0, WIDTH, HEIGHT)

          const barWidth = (WIDTH / bufferLength) * 2.5
          let barHeight
          let x = 0

          for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2

            canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)'
            canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight)

            x += barWidth + 1
          }
        }

        draw()
      }
    } catch (e) {
      console.error(e, '!!!')
    }
  }

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  const handleSliderChange = (value: number) => {
    if (!isDragging) {
      audioStore.setCurrentTime(value)
    }
  }

  const handleSliderDragStart = () => {
    setIsDragging(true)
  }

  const handleSliderDragEnd: React.DragEventHandler<HTMLDivElement> = event => {
    if (audioRef.current && event.currentTarget instanceof HTMLDivElement) {
      const rect = event.currentTarget.getBoundingClientRect()
      const offsetX = event.clientX - rect.left
      const percentage = offsetX / rect.width
      const newValue = percentage * audioStore.duration

      audioStore.setCurrentTime(newValue)
    }

    setIsDragging(false)
  }

  const changeAudioSource = (newSrc: string) => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = newSrc
      audioRef.current.load()

      setupVisualizer()
    }
  }

  return (
    <div>
      <canvas ref={canvasRef} width="600" height="100"></canvas>
      <audio ref={audioRef} />
      {audioStore.currentSong && (
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
