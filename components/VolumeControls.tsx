"use client"

import type React from "react"

interface VolumeControlsProps {
  bassVolume: number
  drumsVolume: number
  onBassVolumeChange: (volume: number) => void
  onDrumsVolumeChange: (volume: number) => void
}

export const VolumeControls: React.FC<VolumeControlsProps> = ({
  bassVolume,
  drumsVolume,
  onBassVolumeChange,
  onDrumsVolumeChange,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold">Volume:</label>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <label className="text-xs w-12">Bass:</label>
          <input
            type="range"
            min="0"
            max="100"
            value={bassVolume}
            onChange={(e) => onBassVolumeChange(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-xs w-8 text-right">{bassVolume}</span>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-xs w-12">Drums:</label>
          <input
            type="range"
            min="0"
            max="100"
            value={drumsVolume}
            onChange={(e) => onDrumsVolumeChange(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-xs w-8 text-right">{drumsVolume}</span>
        </div>
      </div>
    </div>
  )
}
