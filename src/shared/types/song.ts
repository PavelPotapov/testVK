export interface Song {
  id: number
  title: string
  artist: string
  coverImage: string
  lyrics: string
  audioFile: string
  isAudioLoaded?: boolean 
  isImageLoaded?: boolean
}
