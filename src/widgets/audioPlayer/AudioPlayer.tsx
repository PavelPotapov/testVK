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
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.addEventListener('loadedmetadata', setupVisualizer)

    return () => {
      cleanupAudioContext()
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioStore.setAudio(audioRef.current)
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
      cancelAnimationFrame(animationFrameRef.current!)
      animationFrameRef.current = null
    }
  }

  const setupVisualizer = () => {
    try {
      if (audioRef.current && canvasRef.current) {
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext()
          sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current)
          analyserRef.current = audioContextRef.current.createAnalyser()
          analyserRef.current.fftSize = 512
          sourceRef.current.connect(analyserRef.current)
          analyserRef.current.connect(audioContextRef.current.destination)

          const canvas = canvasRef.current
          const canvasCtx = canvas.getContext('2d')
          if (canvasCtx) {
            const WIDTH = canvas.width
            const HEIGHT = canvas.height
            const bufferLength = analyserRef.current.frequencyBinCount
            const dataArray = new Uint8Array(bufferLength)

            const draw = () => {
              animationFrameRef.current = requestAnimationFrame(draw)

              analyserRef.current!.getByteFrequencyData(dataArray)

              canvasCtx.fillStyle = 'rgb(0, 0, 0)'
              canvasCtx.fillRect(0, 0, WIDTH, HEIGHT)

              console.debug(bufferLength)

              const barWidth = WIDTH / 5 // Ширина каждого столбца

              for (let i = 0; i < 5; i++) {
                const startIndex = Math.floor((bufferLength / 5) * i)
                const endIndex = Math.floor((bufferLength / 5) * (i + 1))

                // Находим среднее значение амплитуды в каждой группе
                let sum = 0
                for (let j = startIndex; j < endIndex; j++) {
                  sum += dataArray[j]
                }
                const average = sum / (endIndex - startIndex)
                const barHeight = average / 2 // Нормализуем высоту столбца

                canvasCtx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`
                canvasCtx.fillRect(i * barWidth, HEIGHT - barHeight / 2, barWidth, barHeight)
              }
            }

            draw()
          }
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  const changeAudioSource = (newSrc: string) => {
    if (audioRef.current) {
      try {
        audioRef.current.pause()
        audioRef.current.src = newSrc
        audioRef.current.load()
        audioRef.current.play().catch(error => {
          console.error('Failed to play audio:', error)
        })
      } catch (e) {}
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

  return (
    <div>
      <canvas ref={canvasRef} width="16" height="16"></canvas>
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
