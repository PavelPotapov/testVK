import React, { useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Card, Div, Text, Tappable, Image } from '@vkontakte/vkui' // Импорт компонентов Card, Div, Text, Tappable, Image из VKUI
import { Song } from '@/shared/types/song' // Импорт типа трека из общих типов
import { formatSecondsToTime } from '@/shared/lib'
import styles from './TrackItem.module.scss'

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
          <canvas
            ref={canvasRef}
            width={16}
            height={16}
            className={styles.TrackItemCanvas}
          ></canvas>
          <Div className={styles.TrackItem}>
            <Div className={styles.imageContainer}>
              <Image
                size={40}
                loading="lazy"
                src={track.pictures.coverPicture}
                alt={track.coverAlbum}
                srcSet={`${track.pictures.coverPicture} 1x, ${track.pictures.coverPicture2x} 2x`}
                style={{ maxWidth: '100%' }}
                className={styles.TrackItemImg}
              />
              <Div className={isCurrent ? styles.imageOverlay : ''}></Div>
            </Div>

            <Div className={styles.TrackItemInfoAboutTrack}>
              <Text weight="1" className={styles.TrackItemTitleTrack}>
                {track.audio.title}
              </Text>
              <Text className={styles.TrackItemSingerTitle}>{track.artist.name}</Text>
            </Div>
            <Div>
              <Text>
                {isCurrent
                  ? formatSecondsToTime(currentTime)
                  : formatSecondsToTime(track.audio.duration)}
              </Text>
            </Div>
          </Div>
          {/* Эффект затемнения при наведении */}
          {/* TODO: Доделать var */}
          <div
            className={styles.TrackItemOverlay}
            style={{
              backgroundColor: isHovered
                ? 'var(--TrackItemOverlay, rgba(0, 0, 0, 0.1))'
                : 'transparent'
            }}
          />
        </Card>
      </Tappable>
    )
  }
)

export default TrackItem
