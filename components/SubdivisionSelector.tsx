"use client"

import type React from "react"

interface SubdivisionSelectorProps {
  subdivision: number
  onSubdivisionChange: (subdivision: number) => void
}

export const SubdivisionSelector: React.FC<SubdivisionSelectorProps> = ({ subdivision, onSubdivisionChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-semibold">Grid:</span>
      <button
        onClick={() => onSubdivisionChange(16)}
        className={`px-3 py-1 rounded text-sm ${
          subdivision === 16 ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        16th Notes
      </button>
      <button
        onClick={() => onSubdivisionChange(32)}
        className={`px-3 py-1 rounded text-sm ${
          subdivision === 32 ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        32nd Notes
      </button>
      <button
        onClick={() => onSubdivisionChange(24)}
        className={`px-3 py-1 rounded text-sm ${
          subdivision === 24 ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        Triplets
      </button>
    </div>
  )
}
