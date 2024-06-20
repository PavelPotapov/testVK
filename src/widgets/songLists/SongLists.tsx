// SongList.tsx
import React from 'react'
import { observer } from 'mobx-react-lite'
import { List, Cell } from '@vkontakte/vkui'
import audioStore from '@/app/store/AudioStore'
import { Song } from '@/shared/types/song'

const SongList: React.FC = observer(() => {
  const handleSongClick = (song: Song) => {
    console.log('Clicked song:', song)
    if (audioStore.currentSong && audioStore.currentSong.id === song.id) {
      console.log('Toggling play/pause')
      audioStore.playPause()
    } else {
      console.log('Selecting new song:', song)
      audioStore.selectSong(song)
    }
  }

  return (
    <List>
      {audioStore.songs.map(song => (
        <Cell key={song.id} onClick={() => handleSongClick(song)}>
          <div>
            <p>
              {song.title} - {song.artist}
            </p>
            {audioStore.currentSong && audioStore.currentSong.id === song.id && (
              <div>
                <p>Current Song: {song.title}</p>
                <p>Artist: {song.artist}</p>
                <p>
                  Album Cover: <img src={song.coverImage} alt="Album Cover" />
                </p>
              </div>
            )}
          </div>
        </Cell>
      ))}
    </List>
  )
})

export default SongList
