import React, { useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import audioStore from '@/app/store/AudioStore'
import { Slider } from '@vkontakte/vkui' // Подставьте корректные импорты из вашего UI-фреймворка
import { roundRect } from '../lib/canvas'

const AudioPlayer: React.FC = observer(() => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null) // Создаем реф для canvas
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null) // Реф на контекст canvas
  const [isDragging, setIsDragging] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.addEventListener('loadedmetadata', setupVisualizer)
    if (audioRef.current) {
      audioStore.setAudio(audioRef.current)
    }
    return () => {
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
      cancelAnimationFrame(animationFrameRef.current!)
      animationFrameRef.current = null
    }
  }

  const setupVisualizer = () => {
    try {
      if (audioRef.current && audioStore.canvas) {
        canvasRef.current = audioStore.canvas
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext()
          sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current)
          analyserRef.current = audioContextRef.current.createAnalyser()
          analyserRef.current.fftSize = 512
          sourceRef.current.connect(analyserRef.current)
          analyserRef.current.connect(audioContextRef.current.destination)

          const canvas = canvasRef.current
          const canvasCtx = canvas?.getContext('2d')
          if (canvasCtx && canvas) {
            canvasCtxRef.current = canvasCtx
            const WIDTH = canvas.width
            const HEIGHT = canvas.height
            const bufferLength = analyserRef.current.frequencyBinCount
            const dataArray = new Uint8Array(bufferLength)

            const gap = 2 // Отступ между столбиками
            const barWidth = (WIDTH - gap * 4) / 5 // Ширина каждого столбца с учетом отступов
            const borderRadius = 10 // Радиус скругления углов

            const draw = () => {
              animationFrameRef.current = requestAnimationFrame(draw)

              analyserRef.current!.getByteFrequencyData(dataArray)

              // Очищаем канвас
              canvasCtxRef.current!.clearRect(0, 0, WIDTH, HEIGHT)

              // Очищаем канвас только при изменении состояния паузы
              if (audioStore.isPlaying) {
                canvasCtxRef.current!.clearRect(0, 0, WIDTH, HEIGHT)
              }

              // Отключаем антиалиасинг
              canvasCtxRef.current!.imageSmoothingEnabled = false

              const barHeightScale = HEIGHT / 255 // Масштаб высоты столбиков по максимальному значению

              for (let i = 0; i < 5; i++) {
                const startIndex = Math.floor((bufferLength / 5) * i)
                const endIndex = Math.floor((bufferLength / 5) * (i + 1))

                // Находим среднее значение амплитуды в каждой группе
                let sum = 0
                for (let j = startIndex; j < endIndex; j++) {
                  sum += dataArray[j]
                }
                const average = sum / (endIndex - startIndex)
                const barHeight = average * barHeightScale // Нормализуем высоту столбика

                // Рисуем скругленный столбик
                canvasCtxRef.current!.fillStyle = `rgb(255, 255, 255)`
                roundRect(
                  canvasCtxRef.current!,
                  i * (barWidth + gap) + gap / 2, // x1
                  HEIGHT - barHeight, // y1
                  i * (barWidth + gap) + gap / 2 + barWidth, // x2
                  HEIGHT, // y2
                  borderRadius // radius
                )
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
    // Обновляем canvas и контекст, если меняется canvas
    canvasRef.current = audioStore.canvas
    const canvasCtx = canvasRef.current?.getContext('2d')
    if (canvasCtx) {
      canvasCtxRef.current = canvasCtx
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
