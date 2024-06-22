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
  coverPicture: string
  coverPicture2x?: string
  coverAlbum?: string
  artistLink: string
  lyrics: string
  audioFileUrl: string
  audioDetailLink?: string
  duration: number
}

// {
//       "id": "3",
//       "title": "Another Song",
//       "artist": {
//         "name": "Artist Name",
//         "artistLink": "https:/vk/1231"
//       },
//       "pictures": {
//         "coverPicture": "/images/trackFirst_1x.png",
//         "coverPicture2x": "/images/trackFirst_2x.png"
//       },
//       "album": {
//         "coverAlbum": "Обложка альбома"
//       },
//       "audio": {
//         "title": "Another Song",
//         "lyrics": "Another sample lyrics...",
//         "audioFileUrl": "/audio/test2.mp3",
//         "duration": 55,
//         "audioDetailLink": "https:/vk/audio/1231"
//       }
//     }
