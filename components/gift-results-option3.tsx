"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowLeft, Gift, Heart, Share2, ShoppingBag, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { calculateMatchScores } from "@/lib/match-calculator"

interface GiftResultsProps {
  formData: any
  onBack: () => void
}

export default function GiftResultsOption3({ formData, onBack }: GiftResultsProps) {
  const [loading, setLoading] = useState(false)
  const [showingSimilar, setShowingSimilar] = useState<string | null>(null)
  const [savedGifts, setSavedGifts] = useState<string[]>([])

  // Get gifts with match scores
  const matchedGifts = calculateMatchScores(formData)

  const regenerateResults = () => {
    setLoading(true)
    // Simulate loading
    setTimeout(() => {
      setLoading(false)
    }, 1500)
  }

  const handleBuyNow = (giftTitle: string) => {
    window.open(`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(giftTitle)}`, "_blank")
  }

  const handleMoreLikeThis = (giftId: string) => {
    setShowingSimilar(showingSimilar === giftId ? null : giftId)
  }

  const handleShare = (giftTitle: string) => {
    if (navigator.share) {
      navigator.share({
        title: "Check out this gift idea!",
        text: `I found this great gift idea: ${giftTitle}`,
        url: window.location.href,
      })
    } else {
      alert(`Share feature coming soon! You selected: ${giftTitle}`)
    }
  }

  const toggleSaveGift = (giftTitle: string) => {
    if (savedGifts.includes(giftTitle)) {
      setSavedGifts(savedGifts.filter((title) => title !== giftTitle))
    } else {
      setSavedGifts([...savedGifts, giftTitle])
    }
  }

  // Generate a pastel color based on the gift title
  const getPastelColor = (title: string) => {
    const colors = [
      "bg-pink-100",
      "bg-blue-100",
      "bg-green-100",
      "bg-purple-100",
      "bg-yellow-100",
      "bg-indigo-100",
      "bg-red-100",
      "bg-orange-100",
    ]
    const index = title.length % colors.length
    return colors[index]
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={regenerateResults}
          disabled={loading}
          className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
        >
          <Sparkles className="w-4 h-4" />
          {loading ? "Finding new ideas..." : "Surprise Me!"}
        </Button>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
          Perfect Gift Ideas
        </h2>
        <p className="text-gray-600 mt-2">
          Personalized for {formData.relationship} • {formData.occasion}
        </p>
      </div>

      <div className="space-y-8">
        {matchedGifts.slice(0, 6).map((gift, index) => (
          <div key={index} className="space-y-4">
            <div
              className={`rounded-2xl overflow-hidden shadow-lg border-2 border-gray-100 ${getPastelColor(gift.title)}`}
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/5 relative">
                  <Image
                    src={gift.imageUrl || "/placeholder.svg"}
                    alt={gift.title}
                    width={500}
                    height={400}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 bg-white text-black px-3 py-1 rounded-full text-sm font-bold shadow-md">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-yellow-500" />
                      {gift.matchScore}% Match
                    </span>
                  </div>
                </div>
                <div className="md:w-3/5 p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold">{gift.title}</h3>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-8 w-8"
                        onClick={() => toggleSaveGift(gift.title)}
                      >
                        <Heart
                          className={`w-4 h-4 ${savedGifts.includes(gift.title) ? "fill-red-500 text-red-500" : ""}`}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-8 w-8"
                        onClick={() => handleShare(gift.title)}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {gift.tags.map((tag, i) => (
                      <Badge key={i} className="bg-white text-gray-800 border border-gray-200 hover:bg-gray-100">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <p className="text-gray-700 mt-4">{gift.description}</p>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-xl font-bold">${gift.priceRange}</div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleBuyNow(gift.title)}
                        className="bg-black hover:bg-gray-800 text-white"
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Buy Now
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleMoreLikeThis(gift.title)}
                        className="border-gray-300"
                      >
                        <Gift className="w-4 h-4 mr-2" />
                        More Like This
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Similar items section */}
            {showingSimilar === gift.title && (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                {matchedGifts
                  .filter((g) => g.title !== gift.title && g.tags.some((t) => gift.tags.includes(t)))
                  .slice(0, 3)
                  .map((similarGift, idx) => (
                    <div
                      key={idx}
                      className={`rounded-xl overflow-hidden shadow-md ${getPastelColor(similarGift.title)}`}
                    >
                      <div className="relative">
                        <Image
                          src={similarGift.imageUrl || "/placeholder.svg"}
                          alt={similarGift.title}
                          width={400}
                          height={300}
                          className="w-full object-cover h-48"
                        />
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/30 to-transparent" />
                        <div className="absolute bottom-3 left-3 bg-white text-black px-2 py-1 rounded-full text-xs font-bold shadow-md">
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-yellow-500" />
                            {similarGift.matchScore}%
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h5 className="font-bold">{similarGift.title}</h5>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{similarGift.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-sm font-bold">${similarGift.priceRange}</p>
                          <Button
                            size="sm"
                            className="bg-black hover:bg-gray-800 text-white text-xs h-8"
                            onClick={() => handleBuyNow(similarGift.title)}
                          >
                            <ShoppingBag className="w-3 h-3 mr-1" />
                            Buy
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

