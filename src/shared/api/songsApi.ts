import type { Song } from '@/shared/types/song'
import { API_ENDPOINTS } from '../config/constants'

export async function getSongs(): Promise<Song[]> {
  try {
    const response = await fetch(API_ENDPOINTS.songs.getSongs)
    const data = await response.json()
    return data.songs
  } catch (error) {
    console.error('Error fetching songs:', error)
    return []
  }
}
