"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BassGrooveCreator from "@/components/BassGrooveCreator"
import DrumGrooveCreator from "@/components/DrumGrooveCreator"

export default function Home() {
  const [activeTab, setActiveTab] = useState("bass")
  const [isPlayingBass, setIsPlayingBass] = useState(false)
  const [isPlayingDrums, setIsPlayingDrums] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space" && event.target === document.body) {
        event.preventDefault()
        if (activeTab === "bass") {
          setIsPlayingBass((prev) => !prev)
        } else {
          setIsPlayingDrums((prev) => !prev)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [activeTab])

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-4">Groove Creator</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="bass">🎸 Bass</TabsTrigger>
          <TabsTrigger value="drums">🥁 Drums</TabsTrigger>
        </TabsList>

        <TabsContent value="bass">
          <BassGrooveCreator isPlaying={isPlayingBass} setIsPlaying={setIsPlayingBass} />
        </TabsContent>

        <TabsContent value="drums">
          <DrumGrooveCreator isPlaying={isPlayingDrums} setIsPlaying={setIsPlayingDrums} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
