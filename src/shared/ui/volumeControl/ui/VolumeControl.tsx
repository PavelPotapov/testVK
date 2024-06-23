import React from 'react'
import { Icon28VolumeCircleFillGray } from '@vkontakte/icons'
import { Slider, Div } from '@vkontakte/vkui'
import styles from './Volume.module.scss'

interface VolumeControlProps {
  volume: number
  onVolumeChange: (value: number) => void
}

export const VolumeControl: React.FC<VolumeControlProps> = ({ volume, onVolumeChange }) => {
  return (
    <Div className={styles.VolumeControl}>
      <Icon28VolumeCircleFillGray />
      <Slider
        value={volume}
        min={0}
        max={100}
        onChange={onVolumeChange}
        style={{ width: '100%', marginLeft: '10px' }}
      />
    </Div>
  )
}
