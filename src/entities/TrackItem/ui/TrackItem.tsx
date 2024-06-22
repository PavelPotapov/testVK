import React, { useRef, useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Card, Div, Text, Tappable, Image } from '@vkontakte/vkui' // Импорт компонентов Card, Div, Text, Tappable, Image из VKUI
import { Song } from '@/shared/types/song' // Импорт типа трека из общих типов
import { formatSecondsToTime } from '@/shared/lib'
import styles from './TrackItem.module.scss'
import audioStore from '@/app/store/AudioStore'

interface TrackItemProps {
  track: Song
  isCurrent: boolean // Определяет, является ли трек текущим (выбранным)
  onTrackClick: (track: Song, canvas: HTMLCanvasElement) => void
  currentTime: number
}

export const TrackItem: React.FC<TrackItemProps> = observer(
  ({ track, isCurrent, onTrackClick, currentTime }) => {
    const [isHovered, setIsHovered] = useState(false)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const handleMouseEnter = () => {
      setIsHovered(true)
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
    }

    const handleSongClick = () => {
      if (canvasRef.current) onTrackClick(track, canvasRef.current)
    }

    // Формирование класса карточки в зависимости от выбранного состояния
    const cardMode = isCurrent ? 'shadow' : 'outline-tint'

    return (
      <Tappable onClick={handleSongClick}>
        <Card
          mode={cardMode}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          <canvas ref={canvasRef} width={160} height={160}></canvas>
          <Div className={styles.TrackItem}>
            <Image
              size={40}
              loading="lazy"
              src={track.coverImage}
              alt="Album Cover"
              style={{ maxWidth: '100%' }}
              className={styles.TrackItemImg}
            />
            <Div className={styles.TrackItemInfoAboutTrack}>
              <Text weight="1" className={styles.TrackItemTextTitleTrack}>
                {track.title}
              </Text>
              <Text className={styles.TrackItemSingerTitle}>{track.artist}</Text>
            </Div>
            <Div>
              <Text>
                {isCurrent ? formatSecondsToTime(currentTime) : formatSecondsToTime(track.duration)}
              </Text>
            </Div>
          </Div>
          {/* Эффект затемнения при наведении */}
          <div
            className="overlay"
            style={{
              backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
              transition: 'background-color 0.3s ease',
              pointerEvents: 'none', // Чтобы не мешал обработке кликов на Card
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 1
            }}
          />
        </Card>
      </Tappable>
    )
  }
)

export default TrackItem
