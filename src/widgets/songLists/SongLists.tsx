import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { List, Cell } from '@vkontakte/vkui'
import audioStore from '@/app/store/AudioStore'
import { Song } from '@/shared/types/song'

const SongList: React.FC = observer(() => {
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Обновляем время воспроизведения каждую секунду
      audioStore.updateTime()
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  const handleSongClick = (song: Song) => {
    if (audioStore.isCurrentSong(song)) {
      audioStore.playPause()
    } else {
      audioStore.selectSong(song)
    }
  }

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  return (
    <List>
      {audioStore.songs.map(song => (
        <Cell key={song.id} onClick={() => handleSongClick(song)}>
          <div>
            <p>
              {song.title} - {song.artist}
            </p>
            <div>
              <p>Artist: {song.artist}</p>
              <p>
                Duration:{' '}
                {audioStore.isCurrentSong(song)
                  ? formatTime(audioStore.currentTime)
                  : formatTime(song.duration)}
              </p>
              <p>
                Album Cover: <img src={song.coverImage} alt="Album Cover" />
              </p>
              {audioStore.currentSong && audioStore.currentSong.id === song.id && (
                <div>
                  <p>Current Song: {song.title}</p>
                </div>
              )}
            </div>
          </div>
        </Cell>
      ))}
    </List>
  )
})

export default SongList
