import { makeAutoObservable } from 'mobx'
import type { Song } from '@/shared/types/song'
import { getSongs } from '@/shared/api'

/**
 * Класс для управления аудио-плеером и песнями.
 */
class AudioStore {
  audio: HTMLAudioElement | null = null // Аудио элемент плеера
  isPlaying: boolean = false // Флаг состояния воспроизведения
  currentTime: number = 0 // Текущее время воспроизведения
  duration: number = 0 // Длительность текущего аудио
  audioTitle: string = '' // Название текущей песни
  artistName: string = '' // Имя исполнителя текущей песни
  lyrics: string = '' // Тексты текущей песни
  audioFileLink: string = '' // Ссылка на аудиофайл текущей песни
  songs: Song[] = [] // Список всех песен
  isLoading: boolean = false // Флаг загрузки списка песен
  currentSong: Song | null = null // Текущая выбранная песня
  canvas: HTMLCanvasElement | null = null // Элемент canvas для визуализации аудио

  private static instance: AudioStore // Статическая переменная для хранения единственного экземпляра класса

  /**
   * Конструктор класса AudioStore.
   * Инициализирует observable свойства и загружает список песен.
   */
  constructor() {
    makeAutoObservable(this)
    this.loadSongs()
  }

  /**
   * Возвращает единственный экземпляр класса AudioStore.
   * @returns {AudioStore} Единственный экземпляр класса AudioStore.
   */
  static getInstance(): AudioStore {
    if (!AudioStore.instance) {
      AudioStore.instance = new AudioStore()
    }
    return AudioStore.instance
  }

  /**
   * Загружает список песен асинхронно.
   * Устанавливает флаг isLoading в true во время загрузки.
   * В случае ошибки выводит ошибку в консоль и устанавливает isLoading в false.
   * @async
   * @returns {Promise<void>} Промис без возвращаемого значения.
   */
  async loadSongs(): Promise<void> {
    try {
      this.isLoading = true
      this.songs = await getSongs()
    } catch (error) {
      console.error('Error loading songs:', error)
    } finally {
      this.isLoading = false
    }
  }

  /**
   * Устанавливает аудио элемент плеера.
   * @param {HTMLAudioElement} audioElement - Аудио элемент плеера.
   */
  setAudio(audioElement: HTMLAudioElement): void {
    this.audio = audioElement
    this._bindEvents()
  }

  /**
   * Устанавливает элемент canvas для визуализации аудио.
   * @param {HTMLCanvasElement} canvas - Элемент canvas для визуализации аудио.
   */
  setCanvas(canvas: HTMLCanvasElement): void {
    this.canvas = canvas
  }

  /**
   * Устанавливает состояние воспроизведения.
   * @param {boolean} state - Состояние воспроизведения (true - играет, false - остановлено).
   */
  setIsPlaying(state: boolean): void {
    this.isPlaying = state
  }

  /**
   * Устанавливает детали текущей играющей песни.
   * @param {Song} song - Детали песни.
   */
  setSongDetails({ title, artist, audio, id }: Song): void {
    this.audioTitle = title
    this.artistName = artist.name
    this.lyrics = audio.lyrics
    this.audioFileLink = audio.audioFileLink
    const foundSong = this.songs.find(s => s.id === id)
    if (foundSong) {
      this.currentSong = foundSong
    }
  }

  /**
   * Выбирает песню для воспроизведения и устанавливает соответствующие детали.
   * @param {Song} song - Выбранная песня для воспроизведения.
   */
  selectSong(song: Song): void {
    this.setSongDetails(song)
    if (this.audio) {
      this.audio.currentTime = 0
      this.audio.src = this.audioFileLink
    }
    this.isPlaying = true
  }

  /**
   * Переключает состояние воспроизведения аудио (play/pause).
   */
  togglePlaying(): void {
    if (this.audio) {
      if (this.isPlaying) {
        this.audio.pause()
      } else {
        this.audio.play()
      }
      this.isPlaying = !this.isPlaying
    }
  }

  /**
   * Обновляет текущее время воспроизведения аудио.
   */
  updateTime = (): void => {
    if (this.audio) {
      this.currentTime = this.audio.currentTime
    }
  }

  /**
   * Обновляет длительность текущего аудио.
   */
  updateDuration = (): void => {
    if (this.audio) {
      this.duration = this.audio.duration
    }
  }

  /**
   * Устанавливает текущее время воспроизведения аудио.
   * @param {number} time - Время в секундах.
   */
  setCurrentTime(time: number): void {
    if (this.audio) {
      this.audio.currentTime = time
    }
  }

  /**
   * Проверяет, является ли переданная песня текущей играющей.
   * @param {Song} song - Проверяемая песня.
   * @returns {boolean} true, если песня текущая, false в противном случае.
   */
  isCurrentSong(song: Song): boolean {
    return this.currentSong?.id === song.id
  }

  /**
   * Приватный метод для привязки событий к аудио элементу.
   * Добавляет обработчики событий timeupdate и loadedmetadata.
   */
  private _bindEvents(): void {
    if (!this.audio) return
    this.audio.addEventListener('timeupdate', this.updateTime)
    this.audio.addEventListener('loadedmetadata', this.updateDuration)
  }
}

export default AudioStore.getInstance()
