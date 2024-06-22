import React from 'react'
import { Icon28VolumeCircleFillGray } from '@vkontakte/icons'
import { Slider } from '@vkontakte/vkui'

interface VolumeControlProps {
  volume: number
  onVolumeChange: (value: number) => void
}

const VolumeControl: React.FC<VolumeControlProps> = ({ volume, onVolumeChange }) => {
  return (
    <div style={{ width: '200px', display: 'flex', alignItems: 'center' }}>
      <Icon28VolumeCircleFillGray />
      <Slider
        value={volume}
        min={0}
        max={100}
        onChange={onVolumeChange}
        style={{ width: '100%', marginLeft: '10px' }}
      />
    </div>
  )
}

export default VolumeControl
