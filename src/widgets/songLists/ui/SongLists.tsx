import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { List } from '@vkontakte/vkui'
import { Song } from '@/shared/types/song'
import { TrackItem } from '@/entities/TrackItem'
import audioStore from '@/app/store/AudioStore'
import styles from './SongLists.module.scss'

export const SongList: React.FC = observer(() => {
  useEffect(() => {
    const intervalId = setInterval(() => {
      audioStore.updateTime()
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  const handleSongClick = (song: Song, canvas: HTMLCanvasElement) => {
    if (audioStore.isCurrentSong(song)) {
      audioStore.togglePlaying()
    } else {
      audioStore.selectSong(song)
      audioStore.setCanvas(canvas)
    }
  }

  return (
    <div>
      <List className={styles.SongLists}>
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
    </div>
  )
})
