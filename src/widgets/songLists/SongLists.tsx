import React from 'react'
import { observer } from 'mobx-react-lite'
import { List, Cell } from '@vkontakte/vkui'
import audioStore from '@/app/store/AudioStore'

const SongList: React.FC = observer(() => {
  return (
    <List>
      {audioStore.songs.map(song => (
        <Cell key={song.id} onClick={() => audioStore.selectSong(song)}>
          {song.title} - {song.artist}
        </Cell>
      ))}
    </List>
  )
})

export default SongList
