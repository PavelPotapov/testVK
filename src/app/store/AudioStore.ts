import { makeAutoObservable } from 'mobx'
import { Song } from '@/shared/types/song'
import { getSongs } from '@/shared/api'

class AudioStore {
  audio: HTMLAudioElement | null = null
  isPlaying: boolean = false
  currentTime: number = 0
  duration: number = 0
  audioTitle: string = ''
  artistName: string = ''
  lyrics: string = ''
  audioFileLink: string = ''
  songs: Song[] = []
  isLoading: boolean = false
  currentSong: Song | null = null
  canvas: HTMLCanvasElement | null = null

  private static instance: AudioStore

  constructor() {
    makeAutoObservable(this)
    this.loadSongs()
  }

  static getInstance() {
    if (!AudioStore.instance) {
      AudioStore.instance = new AudioStore()
    }
    return AudioStore.instance
  }

  async loadSongs() {
    try {
      this.isLoading = true
      this.songs = await getSongs()
    } catch (error) {
      console.error('Error loading songs:', error)
    } finally {
      this.isLoading = false
    }
  }

  setAudio(audioElement: HTMLAudioElement) {
    this.audio = audioElement
    this._bindEvents()
  }

  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas
  }

  setIsPlaying(state: boolean) {
    this.isPlaying = state
  }

  async setSongDetails({ title, artist, audio, id }: Song) {
    this.audioTitle = title
    this.artistName = artist.name
    this.lyrics = audio.lyrics
    this.audioFileLink = audio.audioFileLink
    const song = this.songs.find(song => song.id === id)
    if (song) {
      this.currentSong = song
    }
  }

  selectSong(song: Song) {
    this.setSongDetails(song)
    if (this.audio) {
      this.audio.currentTime = 0
      this.audio.src = this.audioFileLink
    }
    this.isPlaying = true
  }

  togglePlaying() {
    if (this.audio) {
      if (this.isPlaying) {
        this.audio.pause()
      } else {
        this.audio.play()
      }
      this.isPlaying = !this.isPlaying
    }
  }

  updateTime = () => {
    if (this.audio) {
      this.currentTime = this.audio.currentTime
    }
  }

  updateDuration = () => {
    if (this.audio) {
      this.duration = this.audio.duration
    }
  }

  setCurrentTime(time: number) {
    if (this.audio) {
      this.audio.currentTime = time
    }
  }

  isCurrentSong(song: Song) {
    return this.currentSong?.id === song.id
  }

  private _bindEvents() {
    if (!this.audio) return
    this.audio.addEventListener('timeupdate', this.updateTime)
    this.audio.addEventListener('loadedmetadata', this.updateDuration)
  }
}

export default AudioStore.getInstance()
