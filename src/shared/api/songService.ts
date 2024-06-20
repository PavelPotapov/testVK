import { Song } from '@/shared/types/song'

export async function fetchSongs(): Promise<Song[]> {
  try {
    const response = await fetch('/songs/songs.json') // Предположим, что API эндпоинт для песен находится по адресу '/api/songs'
    const data = await response.json()
    return data.songs
  } catch (error) {
    console.error('Error fetching songs:', error)
    return []
  }
}
