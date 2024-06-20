export interface Song {
  id: string
  title: string
  artist: string
  coverImage: string
  lyrics: string
  audioFileUrl: string
  duration: number
  isImageLoaded?: boolean
  isAudioLoaded?: boolean
}
