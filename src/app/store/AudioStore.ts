// src/app/store/AudioStore.ts
import { makeAutoObservable } from 'mobx'
import { Song } from '@/shared/types/song'
import { fetchSongs } from '@/shared/api/songService'

class AudioStore {
  audio: HTMLAudioElement | null = null // HTMLAudioElement для управления аудио
  isPlaying: boolean = false // Флаг для отслеживания состояния проигрывания
  currentTime: number = 0 // Текущее время воспроизведения
  duration: number = 0 // Длительность аудиозаписи
  songTitle: string = '' // Название текущей песни
  artist: string = '' // Исполнитель текущей песни
  coverImage: string = '' // URL обложки текущей песни
  lyrics: string = '' // Текст песни
  audioFileUrl: string = '' // URL аудиофайла текущей песни
  songs: Song[] = [] // Массив всех песен
  isLoading: boolean = false // Флаг загрузки данных по списку аудиозаписей
  currentSong: Song | null = null // Текущая выбранная песня

  constructor() {
    makeAutoObservable(this) // Используем makeAutoObservable для автоматического отслеживания изменений
    this.loadSongs() // Загружаем список песен при создании экземпляра стора
  }

  // Асинхронная функция для загрузки списка песен
  async loadSongs() {
    try {
      this.isLoading = true // Устанавливаем флаг загрузки
      this.songs = await fetchSongs() // Загружаем список песен через API
      this.songs.forEach(song => {
        song.isImageLoaded = false // Устанавливаем флаги загрузки изображения и аудио для каждой песни
        song.isAudioLoaded = false
      })
    } catch (error) {
      console.error('Error loading songs:', error) // Обрабатываем ошибки загрузки песен
    } finally {
      this.isLoading = false // Снимаем флаг загрузки независимо от результата
    }
  }

  // Устанавливаем HTMLAudioElement для управления проигрыванием
  setAudio(audioElement: HTMLAudioElement) {
    this.audio = audioElement
    this._bindEvents() // Привязываем события проигрывания аудио
  }

  // Устанавливаем детали выбранной песни и загружаем изображение и аудио
  async setSongDetails({ title, artist, coverImage, lyrics, audioFileUrl }: Song) {
    this.songTitle = title
    this.artist = artist
    this.coverImage = coverImage
    this.lyrics = lyrics
    this.audioFileUrl = audioFileUrl

    const song = this.songs.find(song => song.audioFileUrl === audioFileUrl) // Находим текущую песню в списке
    if (song) {
      this.currentSong = song // Устанавливаем текущую песню
    }

    // Проверяем, загружены ли изображение и аудио для текущей песни
    if (!song?.isImageLoaded) {
      await this.loadImage(coverImage) // Если нет, загружаем изображение
    }
    if (!song?.isAudioLoaded) {
      await this.loadAudio(audioFileUrl) // Если нет, загружаем аудио
    }
  }

  // Асинхронная функция для загрузки изображения
  async loadImage(imageUrl: string) {
    if (!imageUrl) return // Если URL изображения отсутствует, выходим из функции
    try {
      const image = new Image() // Создаем новый элемент изображения
      image.onload = () => {
        const song = this.songs.find(song => song.coverImage === imageUrl) // Находим песню по URL изображения
        if (song) {
          song.isImageLoaded = true // Устанавливаем флаг загрузки изображения
        }
      }
      image.src = imageUrl // Устанавливаем URL изображения для загрузки
    } catch (error) {
      console.error('Error loading image:', error) // Обрабатываем ошибки загрузки изображения
    }
  }

  // Асинхронная функция для загрузки аудио
  async loadAudio(audioUrl: string) {
    if (!audioUrl) return // Если URL аудиофайла отсутствует, выходим из функции
    try {
      const audio = new Audio() // Создаем новый элемент Audio
      audio.onloadedmetadata = () => {
        const song = this.songs.find(song => song.audioFileUrl === audioUrl) // Находим песню по URL аудиофайла
        if (song) {
          song.isAudioLoaded = true // Устанавливаем флаг загрузки аудио
        }
      }
      audio.src = audioUrl // Устанавливаем URL аудиофайла для загрузки
      audio.load() // Загружаем аудио
    } catch (error) {
      console.error('Error loading audio:', error) // Обрабатываем ошибки загрузки аудиофайла
    }
  }

  // Выбираем песню для проигрывания
  selectSong(song: Song) {
    this.isLoading = true // Устанавливаем флаг загрузки

    this.setSongDetails(song) // Устанавливаем детали выбранной песни
      .then(() => {
        if (this.audio) {
          this.audio.pause() // Приостанавливаем текущее аудио
          this.audio.currentTime = 0 // Сбрасываем текущее время воспроизведения
          this.audio.src = this.audioFileUrl // Устанавливаем новый URL аудиофайла
          // this.audio.load() // Загружаем новый аудиофайл
          this.audio.play() // Запускаем воспроизведение новой песни
        }
        this.isPlaying = true // Устанавливаем состояние проигрывания в true (play)
      })
      .catch(error => {
        console.error('Error selecting song:', error) // Обрабатываем ошибки выбора песни
      })
      .finally(() => {
        this.isLoading = false // Снимаем флаг загрузки
      })
  }

  // Включаем или выключаем проигрывание
  togglePlaying() {
    if (this.audio) {
      if (this.isPlaying) {
        this.audio.pause() // Приостанавливаем аудио, если оно играет
      } else {
        this.audio.play() // Запускаем аудио, если оно приостановлено
      }
      this.isPlaying = !this.isPlaying // Изменяем состояние проигрывания
    }
  }

  // Обновляем текущее время воспроизведения
  updateTime = () => {
    if (this.audio) {
      this.currentTime = this.audio.currentTime // Устанавливаем текущее время воспроизведения
    }
  }

  // Обновляем длительность аудиофайла
  updateDuration = () => {
    if (this.audio) {
      this.duration = this.audio.duration // Устанавливаем длительность аудиофайла
    }
  }

  // Устанавливаем текущее время воспроизведения
  setCurrentTime(time: number) {
    if (this.audio) {
      this.audio.currentTime = time // Устанавливаем текущее время воспроизведения аудио
    }
  }

  isCurrentSong(song: Song) {
    return this.currentSong?.id === song.id
  }

  // Метод для удаления аудио элемента из хранилища
  removeAudio() {
    if (this.audio) {
      // Удаляем все привязанные события
      this.audio.removeEventListener('timeupdate', this.updateTime)
      this.audio.removeEventListener('loadedmetadata', this.updateDuration)
      this.audio = null // Очищаем ссылку на элемент аудио
    }
  }

  // Привязываем события проигрывания к аудио
  private _bindEvents() {
    if (!this.audio) return // Если аудио не установлено, выходим из функции

    // Добавляем обработчики событий
    this.audio.addEventListener('timeupdate', this.updateTime) // Событие обновления времени воспроизведения
    this.audio.addEventListener('loadedmetadata', this.updateDuration) // Событие загрузки метаданных аудио
  }
}

export default new AudioStore()
