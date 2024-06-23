import React, { useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Slider, Div, ScreenSpinner } from '@vkontakte/vkui' // Подставьте корректные импорты из вашего UI-фреймворка
import { roundRect } from '../lib/canvas'
import { VolumeControl } from '@/shared/ui/volumeControl'
import audioStore from '@/app/store/AudioStore'
import { formatSecondsToTime } from '@/shared/lib'
import { defaultProps } from '../config'

type PowerOfTwo = 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 | 8192 | 16384 | 32768

interface AudioPlayerProps {
  fftSize?: PowerOfTwo
  gapBars?: number
  countBars?: number
  borderRadiusBars?: number
  backgroundColorBars?: string
}

export const AudioPlayer: React.FC<AudioPlayerProps> = observer(props => {
  const { fftSize, gapBars, countBars, borderRadiusBars, backgroundColorBars } = {
    ...defaultProps,
    ...props
  }
  const [volume, setVolume] = useState(100)
  const [isDragging, setIsDragging] = useState(false)
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    // Создание нового аудиоэлемента и установка обработчика событий
    audioRef.current = new Audio()
    audioRef.current.addEventListener('loadedmetadata', setupVisualizer)

    // Установка аудиоэлемента в хранилище MobX
    if (audioRef.current) {
      audioStore.setAudio(audioRef.current)
    }

    return () => {
      cleanupAudioContext()
    }
  }, [])

  // Изменение трека при изменении ссылки на аудиофайл в хранилище
  useEffect(() => {
    if (audioRef.current && audioStore.audioFileLink) {
      changeAudioSource(audioStore.audioFileLink)
    }
  }, [audioStore.audioFileLink])

  // Очистка состояний и объектов AudioContext при размонтировании компонента
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

  // Очистка холста
  const clearCanvas = () => {
    const canvasCtx = canvasCtxRef.current
    if (canvasCtx) {
      const canvas = canvasCtx.canvas
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  // Настройка визуализации аудиосигнала на холсте
  const setupVisualizer = () => {
    try {
      if (audioRef.current && audioStore.canvas) {
        // Получение ссылки на элемент canvas из хранилища и создание AudioContext
        canvasRef.current = audioStore.canvas
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext()
          sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current)
          analyserRef.current = audioContextRef.current.createAnalyser()
          analyserRef.current.fftSize = fftSize
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

            const gap = gapBars // Отступ между столбиками
            const barWidth = (WIDTH - gap * 4) / countBars // Ширина каждого столбца с учетом отступов
            const borderRadius = borderRadiusBars // Радиус скругления углов

            const draw = () => {
              if (audioStore.isPlaying) {
                analyserRef.current!.getByteFrequencyData(dataArray)

                // Очищаем канвас
                canvasCtxRef.current!.clearRect(0, 0, WIDTH, HEIGHT)

                // Отключаем антиалиасинг
                canvasCtxRef.current!.imageSmoothingEnabled = false

                const barHeightScale = HEIGHT / 255 // Масштаб высоты столбиков по максимальному значению

                for (let i = 0; i < countBars; i++) {
                  const startIndex = Math.floor((bufferLength / countBars) * i)
                  const endIndex = Math.floor((bufferLength / countBars) * (i + 1))

                  // Находим среднее значение амплитуды в каждой группе
                  let sum = 0
                  for (let j = startIndex; j < endIndex; j++) {
                    sum += dataArray[j]
                  }
                  const average = sum / (endIndex - startIndex)
                  const barHeight = average * barHeightScale // Нормализуем высоту столбика

                  // Рисуем скругленный столбик
                  canvasCtxRef.current!.fillStyle = backgroundColorBars
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
              animationFrameRef.current = requestAnimationFrame(draw)
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
      } catch (e) {
        console.error(e)
      }
    }
    //При переключении между треками нужно чистить canvas предыдущего играющего трека.
    clearCanvas()
    // Обновляем canvas и контекст
    canvasRef.current = audioStore.canvas
    const canvasCtx = canvasRef.current?.getContext('2d')
    if (canvasCtx) {
      canvasCtxRef.current = canvasCtx
    }
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

  const handleVolumeChange = (value: number) => {
    setVolume(value)
    if (audioRef.current) {
      audioRef.current.volume = value / 100
    }
  }

  const handleVolumeChangeMobile = (event: React.TouchEvent) => {
    const touch = event.touches[0]
    if (touch) {
      const rect = event.currentTarget.getBoundingClientRect()
      const offsetX = touch.clientX - rect.left
      const percentage = Math.min(Math.max(offsetX / rect.width, 0), 1)
      const newVolume = percentage * 100

      handleVolumeChange(newVolume)
    }
  }

  // Автоматическое переключение трека
  // handleAudioEnded можно было бы прокидывать эту функцию пропсом и кастомизировать действия, логику переключения, либо в сторе это делать, но у меня нет столько времени)
  useEffect(() => {
    const handleAudioEnded = () => {
      // Ищем индекс текущей песни в массиве
      const currentIndex = audioStore.songs.findIndex(
        song => song.id === audioStore.currentSong?.id
      )

      // Переменные для хранения следующей песни и ее canvas
      let nextIdSongWillPlay: string | null = null
      let nextSongCanvas: HTMLCanvasElement | null = null

      if (currentIndex !== -1) {
        // Если текущая песня найдена в массиве
        const nextIndex = currentIndex + 1

        if (nextIndex >= audioStore.songs.length) {
          // Если следующий индекс выходит за пределы массива, начинаем с первой песни
          nextIdSongWillPlay = audioStore.songs[0].id
        } else {
          // Иначе берем следующую песню из массива
          nextIdSongWillPlay = audioStore.songs[nextIndex].id
        }
      }

      if (nextIdSongWillPlay) {
        // Находим следующую песню по ее ID
        const nextSong = audioStore.songs.find(song => song.id === nextIdSongWillPlay)

        if (nextSong) {
          // Находим canvas для следующей песни по data-js атрибуту
          // Самое быстро решение, которое пришло в голову, по хорошему эту переработать.
          // Можно было бы и ref прокидывать, но больше кода
          const canvasSelector = `[data-js-canvas-id="${nextSong.id}"]`
          nextSongCanvas = document.querySelector(canvasSelector)

          if (nextSongCanvas) {
            audioStore.setCanvas(nextSongCanvas)
            audioStore.selectSong(nextSong)
          }
        }
      }
    }

    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleAudioEnded)
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleAudioEnded)
      }
    }
  }, [audioRef.current])

  return (
    <div>
      <audio ref={audioRef} />
      {audioStore.currentSong && (
        <Div className="isHiddenVkUiSliderThumb">
          <Slider
            value={audioStore.currentTime}
            min={0}
            max={audioStore.duration}
            onChange={handleSliderChange}
            onDragStart={handleSliderDragStart}
            onDragEnd={handleSliderDragEnd}
          />
          <p>
            {formatSecondsToTime(audioStore.currentTime)} /{' '}
            {formatSecondsToTime(audioStore.duration)}
          </p>
          <VolumeControl
            volume={volume}
            onVolumeChange={handleVolumeChange}
            onTouchMove={handleVolumeChangeMobile}
            onTouchEnd={handleVolumeChangeMobile}
          />
        </Div>
      )}
      {audioStore.isLoading && <ScreenSpinner state="loading">Загрузка</ScreenSpinner>}
    </div>
  )
})
