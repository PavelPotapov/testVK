import React, { useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Card, Div, Text, Tappable, Image, Link, IconButton, VisuallyHidden } from '@vkontakte/vkui'
import { Song } from '@/shared/types/song' // Импорт типа трека из общих типов
import { formatSecondsToTime } from '@/shared/lib'
import styles from './TrackItem.module.scss'
import { Icon16MoreVertical, Icon24Play, Icon24Pause } from '@vkontakte/icons'
import audioStore from '@/app/store/AudioStore'
import NoteIcon from '@/assets/images/icons/note.svg'

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

    const handleTitleAudioCLick = (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation()
    }

    const handleAuthorClick = (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation()
    }

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
              {track.pictures.coverPicture ? (
                <Image
                  size={40}
                  loading="lazy"
                  src={track.pictures.coverPicture}
                  alt={track.album.coverAlbum}
                  srcSet={`${track.pictures.coverPicture} 1x ${track.pictures.coverPicture2x && ',' + track.pictures.coverPicture2x + '2x'}`}
                  className={styles.TrackItemImg}
                />
              ) : (
                <Div className={styles.TrackItemNoteIconContainer}>
                  <NoteIcon width={'50%'} height={'50%'} />
                </Div>
              )}

              <Div className={isCurrent ? styles.imageOverlay : ''}></Div>
              <Div className={styles.TrackItemPlayIcon}>
                {isHovered && !isCurrent && <Icon24Play />}
                {isHovered && isCurrent && !audioStore.isPlaying && <Icon24Play />}
                {audioStore.isPlaying && isCurrent && isHovered && <Icon24Pause />}
              </Div>
            </Div>

            <Div className={styles.TrackItemInfoAboutTrack}>
              {track.audio.audioDetailLink ? (
                <Div className={styles.TrackItemTitleTrackContainer}>
                  <Link
                    className={styles.TrackItemTitleTrack}
                    href={track.audio.audioDetailLink}
                    onClick={handleTitleAudioCLick}
                  >
                    <Text weight="1">{track.audio.title}</Text>
                  </Link>
                </Div>
              ) : (
                <Text className={styles.TrackItemTitleTrack} weight="1">
                  {track.audio.title}
                </Text>
              )}
              <Div className={styles.TrackItemSingerTitleContainer}>
                <Link
                  href={track.artist.artistLink}
                  className={styles.TrackItemSingerTitleLink}
                  onClick={handleAuthorClick}
                >
                  <Text className={styles.TrackItemSingerTitle}>{track.artist.name}</Text>
                </Link>
              </Div>
            </Div>
            <Div className={styles.TrackItemRightSlotContainer}>
              <Text className={styles.TrackItemTime}>
                {isCurrent
                  ? formatSecondsToTime(currentTime)
                  : formatSecondsToTime(track.audio.duration)}
              </Text>
              <div>
                <IconButton onClick={e => e.stopPropagation()}>
                  <VisuallyHidden>Меню</VisuallyHidden>
                  <Icon16MoreVertical />
                </IconButton>
              </div>
            </Div>
          </Div>

          <div
            className={styles.TrackItemOverlay}
            style={{
              backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.1)' : 'transparent'
            }}
          />
        </Card>
      </Tappable>
    )
  }
)

export default TrackItem
