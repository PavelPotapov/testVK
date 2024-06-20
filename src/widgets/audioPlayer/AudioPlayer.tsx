import React, { useRef, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Panel, PanelHeader, Div, Button, Progress, Slider, usePlatform } from '@vkontakte/vkui'
import audioStore from '@/app/store/AudioStore'
import SongList from '../songLists/SongLists'
import '@vkontakte/vkui/dist/vkui.css'

const AudioPlayer: React.FC = observer(() => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const platform = usePlatform()

  useEffect(() => {
    fetch('/songs/songs.json')
      .then(response => response.json())
      .then(data => {
        audioStore.setSongs(data.songs)
        audioStore.setSongDetails(data.songs[0]) // Устанавливаем первую песню по умолчанию
        if (audioRef.current) {
          audioStore.setAudio(audioRef.current)
        }
      })
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioStore.setAudio(audioRef.current)
    }
  }, [audioStore.audioFile])

  return (
    <Panel>
      <PanelHeader
        before={<Button onClick={() => console.log('Back button clicked')}>Back</Button>}
      >
        Audio Player
      </PanelHeader>
      <Div>
        <SongList />
        {audioStore.coverImage && (
          <img src={audioStore.coverImage} alt="Cover" style={{ width: '100%' }} />
        )}
        <h2>{audioStore.songTitle}</h2>
        <h3>{audioStore.artist}</h3>
        <audio ref={audioRef} src={audioStore.audioFile} preload="metadata" />
        <Button size="l" stretched onClick={() => audioStore.playPause()}>
          {audioStore.isPlaying ? 'Pause' : 'Play'}
        </Button>
        <Progress value={(audioStore.currentTime / audioStore.duration) * 100} />
        <Slider
          value={audioStore.currentTime}
          min={0}
          max={audioStore.duration}
          onChange={value => audioStore.setCurrentTime(value)}
        />
        {platform === 'android' && <p>Running on Android</p>}
        {platform === 'ios' && <p>Running on iOS</p>}
        <pre>{audioStore.lyrics}</pre>
      </Div>
    </Panel>
  )
})

export default AudioPlayer
