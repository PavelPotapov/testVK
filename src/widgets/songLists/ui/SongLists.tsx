import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { List, Cell, Tappable } from '@vkontakte/vkui'
import audioStore from '@/app/store/AudioStore'
import { Song } from '@/shared/types/song'
import { TrackItem } from '@/entities/TrackItem'

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
      audioStore.togglePlaying()
    } else {
      audioStore.selectSong(song)
    }
  }

  return (
    <List>
      {audioStore.songs.map(song => (
        <TrackItem
          key={song.id}
          track={song}
          isCurrent={audioStore.isCurrentSong(song)}
          onTrackClick={handleSongClick}
          currentTime={audioStore.currentTime}
        />
      ))}
    </List>
  )
})

export default SongList
