import { makeAutoObservable } from 'mobx'
import { Song } from '@/shared/types/song'
import { fetchSongs } from '@/shared/api/songService'

class AudioStore {
  audio: HTMLAudioElement | null = null
  isPlaying: boolean = false
  currentTime: number = 0
  duration: number = 0
  songTitle: string = ''
  artist: string = ''
  coverImage: string = ''
  lyrics: string = ''
  audioFileUrl: string = ''
  songs: Song[] = []
  isLoading: boolean = false
  currentSong: Song | null = null

  constructor() {
    makeAutoObservable(this)
    this.loadSongs()
  }

  async loadSongs() {
    try {
      this.isLoading = true
      this.songs = await fetchSongs()
      this.songs.forEach(song => {
        song.isImageLoaded = false
        song.isAudioLoaded = false
      })
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

  async setSongDetails({ title, artist, coverImage, lyrics, audioFileUrl }: Song) {
    this.songTitle = title
    this.artist = artist
    this.coverImage = coverImage
    this.lyrics = lyrics
    this.audioFileUrl = audioFileUrl

    const song = this.songs.find(song => song.audioFileUrl === audioFileUrl)
    if (song) {
      this.currentSong = song
    }

    if (!song?.isImageLoaded) {
      await this.loadImage(coverImage)
    }
    if (!song?.isAudioLoaded) {
      await this.loadAudio(audioFileUrl)
    }
  }

  async loadImage(imageUrl: string) {
    if (!imageUrl) return
    try {
      const image = new Image()
      image.onload = () => {
        const song = this.songs.find(song => song.coverImage === imageUrl)
        if (song) {
          song.isImageLoaded = true
        }
      }
      image.src = imageUrl
    } catch (error) {
      console.error('Error loading image:', error)
    }
  }

  async loadAudio(audioUrl: string) {
    if (!audioUrl) return
    try {
      const audio = new Audio()
      audio.onloadedmetadata = () => {
        const song = this.songs.find(song => song.audioFileUrl === audioUrl)
        if (song) {
          song.isAudioLoaded = true
        }
      }
      audio.src = audioUrl
      audio.load()
    } catch (error) {
      console.error('Error loading audio:', error)
    }
  }

  selectSong(song: Song) {
    this.isLoading = true
    this.setSongDetails(song)
      .then(() => {
        if (this.audio) {
          this.audio.pause()
          this.audio.currentTime = 0
          this.audio.src = this.audioFileUrl
          this.audio.play()
        }
        this.isPlaying = true
      })
      .catch(error => {
        console.error('Error selecting song:', error)
      })
      .finally(() => {
        this.isLoading = false
      })
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

  removeAudio() {
    if (this.audio) {
      this.audio.removeEventListener('timeupdate', this.updateTime)
      this.audio.removeEventListener('loadedmetadata', this.updateDuration)
      this.audio = null
    }
  }

  private _bindEvents() {
    if (!this.audio) return

    this.audio.addEventListener('timeupdate', this.updateTime)
    this.audio.addEventListener('loadedmetadata', this.updateDuration)
  }
}

export default new AudioStore()
