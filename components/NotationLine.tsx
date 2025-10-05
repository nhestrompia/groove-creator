"use client";

import { X } from "lucide-react";
import type React from "react";
import { useState } from "react";

interface Note {
  frequency: number;
  muted: boolean;
  duration: number;
}

interface NotationLineProps {
  notes: (Note | null)[];
  onToggleNote: (index: number, note: Note | null) => void;
  subdivision: number;
  currentBeat: number;
  barIndex: number;
  isPlaying: boolean;
}

export const NotationLine: React.FC<NotationLineProps> = ({
  notes,
  onToggleNote,
  subdivision,
  currentBeat,
  barIndex,
  isPlaying,
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
      return [
        "1",
        "",
        "e",
        "",
        "&",
        "",
        "a",
        "",
        "2",
        "",
        "e",
        "",
        "&",
        "",
        "a",
        "",
        "3",
        "",
        "e",
        "",
        "&",
        "",
        "a",
        "",
        "4",
        "",
        "e",
        "",
        "&",
        "",
        "a",
        "",
      ];
    } else {
      return [
        "1",
        "",
        "",
        "",
        "",
        "",
        "2",
        "",
        "",
        "",
        "",
        "",
        "3",
        "",
        "",
        "",
        "",
        "",
        "4",
        "",
        "",
        "",
        "",
        "",
      ];
    }
  };

  const subdivisionLabels = getSubdivisionLabels();

  const bassNotes = [
    { note: "E1", frequency: 41.2 },
    { note: "F1", frequency: 43.65 },
    { note: "F#1", frequency: 46.25 },
    { note: "G1", frequency: 49.0 },
    { note: "G#1", frequency: 51.91 },
    { note: "A1", frequency: 55.0 },
    { note: "A#1", frequency: 58.27 },
    { note: "B1", frequency: 61.74 },
    { note: "C2", frequency: 65.41 },
    { note: "C#2", frequency: 69.3 },
    { note: "D2", frequency: 73.42 },
    { note: "D#2", frequency: 77.78 },
    { note: "E2", frequency: 82.41 },
    { note: "F2", frequency: 87.31 },
    { note: "F#2", frequency: 92.5 },
    { note: "G2", frequency: 98.0 },
    { note: "G#2", frequency: 103.83 },
    { note: "A2", frequency: 110.0 },
    { note: "A#2", frequency: 116.54 },
    { note: "B2", frequency: 123.47 },
    { note: "C3", frequency: 130.81 },
    { note: "C#3", frequency: 138.59 },
    { note: "D3", frequency: 146.83 },
    { note: "D#3", frequency: 155.56 },
    { note: "E3", frequency: 164.81 },
  ];

  const [openNoteSelector, setOpenNoteSelector] = useState<number | null>(null);
  const [hoveredNote, setHoveredNote] = useState<number | null>(null);
  const [isDraggingDuration, setIsDraggingDuration] = useState(false);

  const handleNoteClick = (index: number, e: React.MouseEvent) => {
    if (e.button === 2) {
      e.preventDefault();
      return;
    }
    if (notes[index]) {
      return;
    }
    setOpenNoteSelector(index);
  };

  const handleNoteSelect = (
    index: number,
    frequency: number,
    muted: boolean
  ) => {
    onToggleNote(index, { frequency, muted, duration: 1 });
    setOpenNoteSelector(null);
  };

  const handleMutedSelect = (index: number) => {
    onToggleNote(index, { frequency: 0, muted: true, duration: 1 });
    setOpenNoteSelector(null);
  };

  const handleRemoveNote = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleNote(index, null);
  };

  const handleDurationChange = (index: number, newDuration: number) => {
    const note = notes[index];
    if (note) {
      onToggleNote(index, { ...note, duration: newDuration });
    }
  };

  const handleDurationDrag = (e: React.MouseEvent, index: number) => {
    if (!isDraggingDuration) return;
    e.preventDefault();
    const note = notes[index];
    if (!note) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, x / width));
    const newDuration = Math.max(1, Math.min(4, Math.ceil(percentage * 4)));

    if (newDuration !== note.duration) {
      handleDurationChange(index, newDuration);
    }
  };

  const getNotesPerBeat = () => {
    if (subdivision === 16) return 4;
    if (subdivision === 32) return 8;
    return 6;
  };

  const notesPerBeat = getNotesPerBeat();
  const cellHeight = subdivision === 32 ? "h-10" : "h-12";

  const getCurrentBarBeat = () => {
    if (!isPlaying || currentBeat < 0) return -1;
    const currentBar = Math.floor(currentBeat / subdivision);
    if (currentBar !== barIndex) return -1;
    return currentBeat % subdivision;
  };

  const activeBeat = getCurrentBarBeat();

  // Check if a cell should be hidden because it's covered by a previous note's duration
  const isCellCovered = (index: number): Note | null => {
    for (let i = index - 1; i >= 0; i--) {
      const previousNote = notes[i];
      if (previousNote && !previousNote.muted) {
        const coverageEnd = i + previousNote.duration;
        if (index < coverageEnd) {
          return previousNote;
        }
      }
    }
    return null;
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex border-t-2 border-b-2 border-black w-fit">
        {notes.map((note, index) => {
          const coveringNote = isCellCovered(index);
          const isActive = note !== null;
          const isCurrentBeat = isPlaying && index === activeBeat;
          const isHovered = hoveredNote === index;

          // If this cell is covered by a previous note's duration, render it as part of that note
          if (coveringNote && !note) {
            return (
              <div
                key={index}
                className="relative flex-1"
                style={{
                  minWidth:
                    subdivision === 32
                      ? "32px"
                      : subdivision === 24
                      ? "40px"
                      : "48px",
                  maxWidth:
                    subdivision === 32
                      ? "32px"
                      : subdivision === 24
                      ? "40px"
                      : "48px",
                  borderLeft:
                    index % notesPerBeat === 0
                      ? "3px solid black"
                      : "1px solid #9ca3af",
                  borderRight:
                    index === notes.length - 1 ? "3px solid black" : "none",
                }}
              >
                <div
                  className={`w-full ${cellHeight} ${
                    isCurrentBeat
                      ? "bg-yellow-300 ring-2 ring-yellow-500 ring-inset animate-pulse"
                      : "bg-blue-400"
                  } transition-colors`}
                />
              </div>
            );
          }

          return (
            <div
              key={index}
              className="relative flex-1 group"
              style={{
                minWidth:
                  subdivision === 32
                    ? "32px"
                    : subdivision === 24
                    ? "40px"
                    : "48px",
                maxWidth:
                  subdivision === 32
                    ? "32px"
                    : subdivision === 24
                    ? "40px"
                    : "48px",
                borderLeft:
                  index % notesPerBeat === 0
                    ? "3px solid black"
                    : "1px solid #9ca3af",
                borderRight:
                  index === notes.length - 1 ? "3px solid black" : "none",
              }}
              onMouseEnter={() => setHoveredNote(index)}
              onMouseLeave={() => {
                setHoveredNote(null);
                setIsDraggingDuration(false);
              }}
            >
              <button
                className={`w-full ${cellHeight} ${
                  isCurrentBeat
                    ? "bg-yellow-300 ring-2 ring-yellow-500 ring-inset"
                    : note?.muted
                    ? "bg-orange-400"
                    : isActive
                    ? "bg-blue-500"
                    : "bg-gray-200"
                } hover:bg-blue-300 transition-colors flex items-center justify-center relative text-xs ${
                  isCurrentBeat ? "animate-pulse" : ""
                } overflow-hidden`}
                onClick={(e) => handleNoteClick(index, e)}
                onContextMenu={(e) => handleNoteClick(index, e)}
              >
                {note?.muted ? (
                  <span
                    className={`font-bold text-base ${
                      isCurrentBeat ? "text-gray-800" : "text-white"
                    } z-10`}
                  >
                    X
                  </span>
                ) : (
                  note && (
                    <span
                      className={`font-semibold text-xs ${
                        isCurrentBeat ? "text-gray-800" : "text-white"
                      } z-10`}
                    >
                      {
                        bassNotes.find((bn) => bn.frequency === note.frequency)
                          ?.note
                      }
                    </span>
                  )
                )}
              </button>

              {/* Hover controls for existing notes */}
              {isActive && isHovered && !openNoteSelector && (
                <div className="absolute inset-0 pointer-events-none z-10">
                  {/* Remove button */}
                  <button
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl hover:bg-red-600 pointer-events-auto"
                    onClick={(e) => handleRemoveNote(index, e)}
                    title="Remove note"
                  >
                    <X size={12} />
                  </button>

                  {/* Duration resizer */}
                  {!note?.muted && (
                    <div className="absolute bottom-0 left-0 right-0 pointer-events-auto">
                      <div className="px-1 pb-1">
                        <div
                          className="bg-white bg-opacity-90 rounded h-4 cursor-ew-resize relative"
                          onMouseDown={() => setIsDraggingDuration(true)}
                          onMouseUp={() => setIsDraggingDuration(false)}
                          onMouseMove={(e) => handleDurationDrag(e, index)}
                          title={`Duration: ${note?.duration}/4`}
                        >
                          <div
                            className="bg-blue-600 h-full rounded transition-all"
                            style={{ width: `${(note?.duration || 1) * 25}%` }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-gray-700">
                            {note?.duration}/4
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {openNoteSelector === index && (
                <div className="absolute z-30 bg-white border-2 border-gray-400 rounded shadow-lg max-h-80 overflow-y-auto top-full mt-1 left-0 min-w-[180px]">
                  <div className="sticky top-0 bg-gray-800 text-white px-2 py-1.5 text-xs font-semibold">
                    Select Note
                  </div>

                  <button
                    className="w-full bg-orange-100 hover:bg-orange-200 px-2 py-2 text-left border-b-2 border-gray-300 font-semibold text-sm"
                    onClick={() => handleMutedSelect(index)}
                  >
                    <span className="text-orange-700">X - Muted</span>
                  </button>

                  <div className="max-h-48 overflow-y-auto">
                    {bassNotes.map((bassNote) => (
                      <button
                        key={bassNote.note}
                        className="block w-full text-left px-2 py-1.5 hover:bg-blue-100 text-xs border-b border-gray-200"
                        onClick={() =>
                          handleNoteSelect(index, bassNote.frequency, false)
                        }
                      >
                        {bassNote.note}
                      </button>
                    ))}
                  </div>

                  <button
                    className="w-full bg-gray-200 text-gray-700 py-1.5 hover:bg-gray-300 font-semibold text-xs"
                    onClick={() => setOpenNoteSelector(null)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex w-full">
        {subdivisionLabels.map((label, index) => (
          <div
            key={index}
            className="text-center text-xs flex-1"
            style={{
              minWidth:
                subdivision === 32
                  ? "32px"
                  : subdivision === 24
                  ? "40px"
                  : "48px",
              maxWidth:
                subdivision === 32
                  ? "32px"
                  : subdivision === 24
                  ? "40px"
                  : "48px",
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
  );
};
