"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowLeft, ChevronDown, ChevronUp, RefreshCw, Share2, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { calculateMatchScores } from "@/lib/match-calculator"

interface GiftResultsProps {
  formData: any
  onBack: () => void
}

export default function GiftResultsOption2({ formData, onBack }: GiftResultsProps) {
  const [loading, setLoading] = useState(false)
  const [showingSimilar, setShowingSimilar] = useState<string | null>(null)

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

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2 text-lg">
          <ArrowLeft className="w-5 h-5" />
          Back to form
        </Button>
        <Button
          variant="default"
          onClick={regenerateResults}
          disabled={loading}
          className="gap-2 bg-black hover:bg-gray-800 text-white"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          New Suggestions
        </Button>
      </div>

      <div className="space-y-12">
        <div>
          <h2 className="text-4xl font-bold tracking-tight">CURATED GIFT IDEAS</h2>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge className="bg-black text-white hover:bg-gray-800 px-3 py-1 rounded-none text-xs">
              For: {formData.relationship}
            </Badge>
            <Badge className="bg-black text-white hover:bg-gray-800 px-3 py-1 rounded-none text-xs">
              Age: {formData.age}
            </Badge>
            <Badge className="bg-black text-white hover:bg-gray-800 px-3 py-1 rounded-none text-xs">
              Occasion: {formData.occasion}
            </Badge>
            <Badge className="bg-black text-white hover:bg-gray-800 px-3 py-1 rounded-none text-xs">
              Gender: {formData.gender}
            </Badge>
          </div>
        </div>

        <div className="space-y-16">
          {matchedGifts.slice(0, 6).map((gift, index) => (
            <div key={index} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative">
                  <Image
                    src={gift.imageUrl || "/placeholder.svg"}
                    alt={gift.title}
                    width={600}
                    height={450}
                    className="w-full object-cover aspect-4/3"
                  />
                  <div className="absolute top-0 left-0 bg-primary text-white px-4 py-2 text-lg font-bold">
                    {gift.matchScore}%
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-3xl font-bold tracking-tight">{gift.title}</h3>
                      <Button variant="ghost" size="sm" onClick={() => handleShare(gift.title)} className="h-8 px-2">
                        <Share2 className="w-5 h-5" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {gift.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="rounded-none text-xs px-3 border-black">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <p className="text-lg mt-4">{gift.description}</p>

                    <div className="mt-6">
                      <div className="text-2xl font-bold">${gift.priceRange}</div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 mt-6">
                    <Button
                      onClick={() => handleBuyNow(gift.title)}
                      className="w-full bg-black hover:bg-gray-800 text-white rounded-none h-12 text-lg"
                    >
                      <ShoppingBag className="w-5 h-5 mr-2" />
                      Buy Now
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleMoreLikeThis(gift.title)}
                      className="w-full rounded-none border-black text-black hover:bg-black hover:text-white h-12 text-lg"
                    >
                      {showingSimilar === gift.title ? (
                        <>
                          <ChevronUp className="w-5 h-5 mr-2" />
                          Hide Similar Items
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-5 h-5 mr-2" />
                          Show Similar Items
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Similar items section */}
              {showingSimilar === gift.title && (
                <div className="border-t-2 border-b-2 border-black py-8">
                  <h4 className="text-2xl font-bold mb-6">SIMILAR RECOMMENDATIONS</h4>
                  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {matchedGifts
                      .filter((g) => g.title !== gift.title && g.tags.some((t) => gift.tags.includes(t)))
                      .slice(0, 3)
                      .map((similarGift, idx) => (
                        <div key={idx} className="group">
                          <div className="relative overflow-hidden">
                            <Image
                              src={similarGift.imageUrl || "/placeholder.svg"}
                              alt={similarGift.title}
                              width={400}
                              height={300}
                              className="w-full object-cover aspect-4/3 group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-0 left-0 bg-primary text-white px-2 py-1 text-sm font-bold">
                              {similarGift.matchScore}%
                            </div>
                          </div>
                          <div className="mt-3">
                            <h5 className="font-bold text-lg">{similarGift.title}</h5>
                            <p className="text-muted-foreground mt-1 line-clamp-2">{similarGift.description}</p>
                            <div className="flex items-center justify-between mt-3">
                              <p className="text-lg font-bold">${similarGift.priceRange}</p>
                              <Button
                                variant="outline"
                                className="rounded-none border-black text-black hover:bg-black hover:text-white"
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

              {index < matchedGifts.slice(0, 6).length - 1 && <Separator className="border-t border-gray-200" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

