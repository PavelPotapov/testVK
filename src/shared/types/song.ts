export type Song = {
  id: string
  title: string
  artist: {
    name: string
    artistLink: string
  }
  pictures: {
    coverPicture: string
    coverPicture2x?: string
  }
  album: {
    coverAlbum?: string
  }
  audio: {
    title: string
    lyrics: string
    audioFileLink: string
    duration: 55
    audioDetailLink?: string
  }
}
