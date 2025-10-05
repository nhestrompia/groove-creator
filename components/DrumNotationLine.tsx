"use client";

import type React from "react";

interface DrumNotationLineProps {
  drumBars: {
    kick: boolean[][];
    snare: boolean[][];
    hihat: boolean[][];
    crash: boolean[][];
    ride: boolean[][];
    tom1: boolean[][];
    tom2: boolean[][];
    tom3: boolean[][];
  };
  barIndex: number;
  subdivision: number;
  currentBeat: number;
  isPlaying: boolean;
  onToggleDrumNote: (
    drumType:
      | "kick"
      | "snare"
      | "hihat"
      | "crash"
      | "ride"
      | "tom1"
      | "tom2"
      | "tom3",
    barIndex: number,
    noteIndex: number
  ) => void;
}

export const DrumNotationLine: React.FC<DrumNotationLineProps> = ({
  drumBars,
  barIndex,
  subdivision,
  currentBeat,
  isPlaying,
  onToggleDrumNote,
}) => {
  const getSubdivisionLabels = () => {
    if (subdivision === 16) {
      return [
        "1",
        "e",
        "&",
        "a",
        "2",
        "e",
        "&",
        "a",
        "3",
        "e",
        "&",
        "a",
        "4",
        "e",
        "&",
        "a",
      ];
    } else if (subdivision === 32) {
      return Array(32)
        .fill("")
        .map((_, i) => {
          const beat = Math.floor(i / 8) + 1;
          const pos = i % 8;
          if (pos === 0) return String(beat);
          if (pos === 2) return "e";
          if (pos === 4) return "&";
          if (pos === 6) return "a";
          return "";
        });
    } else {
      return Array(24)
        .fill("")
        .map((_, i) => {
          const beat = Math.floor(i / 6) + 1;
          if (i % 6 === 0) return String(beat);
          return "";
        });
    }
  };

  const subdivisionLabels = getSubdivisionLabels();

  const drumTypes: Array<{
    key:
      | "kick"
      | "snare"
      | "hihat"
      | "crash"
      | "ride"
      | "tom1"
      | "tom2"
      | "tom3";
    label: string;
    icon: string;
    color: string;
  }> = [
    { key: "kick", label: "Kick", icon: "🦶", color: "bg-red-500" },
    { key: "snare", label: "Snare", icon: "🥁", color: "bg-blue-500" },
    { key: "hihat", label: "Hi-Hat", icon: "🎩", color: "bg-yellow-500" },
    { key: "crash", label: "Crash", icon: "💥", color: "bg-orange-500" },
    { key: "ride", label: "Ride", icon: "🌊", color: "bg-cyan-500" },
    { key: "tom1", label: "Tom 1", icon: "🥁", color: "bg-purple-500" },
    { key: "tom2", label: "Tom 2", icon: "🥁", color: "bg-pink-500" },
    { key: "tom3", label: "Tom 3", icon: "🥁", color: "bg-indigo-500" },
  ];

  const getNotesPerBeat = () => {
    if (subdivision === 16) return 4;
    if (subdivision === 32) return 8;
    return 6;
  };

  const notesPerBeat = getNotesPerBeat();

  const getCurrentBarBeat = () => {
    if (!isPlaying || currentBeat < 0) return -1;
    const currentBar = Math.floor(currentBeat / subdivision);
    if (currentBar !== barIndex) return -1;
    return currentBeat % subdivision;
  };

  const activeBeat = getCurrentBarBeat();

  return (
    <div className="space-y-1">
      {drumTypes.map((drumType) => (
        <div key={drumType.key} className="flex items-center gap-2">
          <div className="w-20 text-xs font-semibold flex items-center gap-1">
            <span>{drumType.icon}</span>
            <span>{drumType.label}</span>
          </div>
          <div className="flex  border-t-2 border-b-2 w-fit border-black">
            {drumBars[drumType.key][barIndex].map((isActive, noteIndex) => {
              const isCurrentBeat = isPlaying && noteIndex === activeBeat;

              return (
                <div
                  key={noteIndex}
                  className="relative flex-1"
                  style={{
                    minWidth:
                      subdivision === 32
                        ? "24px"
                        : subdivision === 24
                        ? "32px"
                        : "40px",
                    maxWidth:
                      subdivision === 32
                        ? "24px"
                        : subdivision === 24
                        ? "32px"
                        : "40px",
                    borderLeft:
                      noteIndex % notesPerBeat === 0
                        ? "3px solid black"
                        : "1px solid #9ca3af",
                    borderRight:
                      noteIndex === subdivision - 1
                        ? "3px solid black"
                        : "none",
                  }}
                >
                  <button
                    className={`w-full h-8 ${
                      isCurrentBeat
                        ? "bg-yellow-300 ring-2 ring-yellow-500 ring-inset"
                        : isActive
                        ? drumType.color
                        : "bg-gray-200"
                    } hover:opacity-80 transition-colors ${
                      isCurrentBeat ? "animate-pulse" : ""
                    }`}
                    onClick={() =>
                      onToggleDrumNote(drumType.key, barIndex, noteIndex)
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="flex items-center gap-2">
        <div className="w-20" />
        <div className="flex flex-1">
          {subdivisionLabels.map((label, index) => (
            <div
              key={index}
              className="text-center text-xs flex-1"
              style={{
                minWidth:
                  subdivision === 32
                    ? "24px"
                    : subdivision === 24
                    ? "32px"
                    : "40px",
                maxWidth:
                  subdivision === 32
                    ? "24px"
                    : subdivision === 24
                    ? "32px"
                    : "40px",
                marginLeft:
                  index % notesPerBeat === 0 && index !== 0 ? "2px" : "0px",
              }}
            >
              <span className={index % notesPerBeat === 0 ? "font-bold" : ""}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
