import { makeAutoObservable } from 'mobx'

class AudioStore {
  audio: HTMLAudioElement | null = null
  isPlaying: boolean = false
  currentTime: number = 0
  duration: number = 0
  songTitle: string = ''
  artist: string = ''
  coverImage: string = '' // URL to the cover image
  lyrics: string = '' // Lyrics of the song
  audioFile: string = ''
  songs: any[] = []

  constructor() {
    makeAutoObservable(this)
  }

  setAudio(audioElement: HTMLAudioElement) {
    this.audio = audioElement
    this._bindEvents()
  }

  setSongDetails({
    title,
    artist,
    coverImage,
    lyrics,
    audioFile
  }: {
    title: string
    artist: string
    coverImage: string
    lyrics: string
    audioFile: string
  }) {
    this.songTitle = title
    this.artist = artist
    this.coverImage = coverImage
    this.lyrics = lyrics
    this.audioFile = audioFile
  }

  setSongs(songs: any[]) {
    this.songs = songs
  }

  selectSong(song: any) {
    this.setSongDetails(song)
    if (this.audio) {
      this.audio.pause()
      this.audio.currentTime = 0
    }
    this.isPlaying = false
  }

  playPause() {
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

  private _bindEvents() {
    if (!this.audio) return

    this.audio.addEventListener('timeupdate', this.updateTime)
    this.audio.addEventListener('loadedmetadata', this.updateDuration)
  }
}

export default new AudioStore()