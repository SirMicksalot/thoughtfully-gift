"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowLeft, Heart, RefreshCw, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { calculateMatchScores } from "@/lib/match-calculator"

interface GiftResultsProps {
  formData: any
  onBack: () => void
}

export default function GiftResultsOption1({ formData, onBack }: GiftResultsProps) {
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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2 rounded-full">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Not finding the perfect gift?</span>
          <Button variant="outline" onClick={regenerateResults} disabled={loading} className="gap-2 rounded-full">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh Ideas
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-serif font-medium">Thoughtfully Selected Gifts</h2>
          <p className="text-muted-foreground mt-2">
            Curated for {formData.relationship} ({formData.age}, {formData.gender}) • {formData.occasion}
          </p>
        </div>

        <div className="space-y-10">
          {matchedGifts.slice(0, 6).map((gift, index) => (
            <div key={index} className="space-y-4">
              <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-2/5 relative">
                    <Image
                      src={gift.imageUrl || "/placeholder.svg"}
                      alt={gift.title}
                      width={500}
                      height={400}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-white text-black px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                      {gift.matchScore}% Match
                    </div>
                  </div>
                  <div className="lg:w-3/5 p-8">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-medium font-serif">{gift.title}</h3>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {gift.tags.map((tag, i) => (
                            <Badge key={i} variant="outline" className="rounded-full text-xs px-3 bg-gray-50">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
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

                    <p className="text-muted-foreground mt-4">{gift.description}</p>

                    <div className="mt-6 flex items-center justify-between">
                      <div className="text-lg font-medium">${gift.priceRange}</div>
                      <div className="flex gap-3">
                        <Button onClick={() => handleBuyNow(gift.title)} className="rounded-full">
                          Shop Now
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleMoreLikeThis(gift.title)}
                          className="rounded-full"
                        >
                          Similar Gifts
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Similar items section */}
              {showingSimilar === gift.title && (
                <div className="pl-4 border-l-2 border-primary/20 py-2">
                  <h4 className="font-medium mb-4 text-lg font-serif">You might also like</h4>
                  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {matchedGifts
                      .filter((g) => g.title !== gift.title && g.tags.some((t) => gift.tags.includes(t)))
                      .slice(0, 3)
                      .map((similarGift, idx) => (
                        <div
                          key={idx}
                          className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="relative h-48">
                            <Image
                              src={similarGift.imageUrl || "/placeholder.svg"}
                              alt={similarGift.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute top-3 left-3 bg-white text-black px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                              {similarGift.matchScore}% Match
                            </div>
                          </div>
                          <div className="p-4">
                            <h5 className="font-medium text-base font-serif">{similarGift.title}</h5>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{similarGift.description}</p>
                            <div className="flex items-center justify-between mt-3">
                              <p className="text-sm font-medium">${similarGift.priceRange}</p>
                              <Button
                                size="sm"
                                className="rounded-full text-xs h-8"
                                onClick={() => handleBuyNow(similarGift.title)}
                              >
                                Shop
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

