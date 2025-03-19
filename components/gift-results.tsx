"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowLeft, ExternalLink, RefreshCw, Share2, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { calculateMatchScores } from "@/lib/match-calculator"

interface GiftResultsProps {
  formData: any
  onBack: () => void
}

export default function GiftResults({ formData, onBack }: GiftResultsProps) {
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
    // Open Google Shopping in a new tab
    window.open(`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(giftTitle)}`, "_blank")
  }

  const handleMoreLikeThis = (giftId: string) => {
    setShowingSimilar(showingSimilar === giftId ? null : giftId)
  }

  const handleShare = (giftTitle: string) => {
    // In a real app, this would open a share dialog
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to form
        </Button>
        <Button variant="outline" onClick={regenerateResults} disabled={loading} className="gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Regenerate
        </Button>
      </div>

      <Card className="overflow-hidden border-2 border-primary/20">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-2xl">Recommended Gift Themes</CardTitle>
          <CardDescription>
            Based on {formData.relationship} ({formData.age}, {formData.gender}) for {formData.occasion}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {matchedGifts.slice(0, 6).map((gift, index) => (
              <div key={index}>
                <Card className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 relative">
                      <Image
                        src={gift.imageUrl || "/placeholder.svg"}
                        alt={gift.title}
                        width={400}
                        height={300}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-sm font-medium">
                        {gift.matchScore}% Match
                      </div>
                    </div>
                    <div className="md:w-2/3 p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold">{gift.title}</h3>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {gift.tags.map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4">{gift.description}</p>

                      <div className="flex items-center justify-between mb-4">
                        <span className="font-medium">${gift.priceRange}</span>
                        <Button variant="ghost" size="sm" onClick={() => handleShare(gift.title)} className="h-8 px-2">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button onClick={() => handleBuyNow(gift.title)} className="gap-2">
                          <ShoppingBag className="w-4 h-4" />
                          Buy Now
                        </Button>
                        <Button variant="outline" onClick={() => handleMoreLikeThis(gift.title)} className="gap-2">
                          <ExternalLink className="w-4 h-4" />
                          More Like This
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Similar items section */}
                {showingSimilar === gift.title && (
                  <div className="mt-2 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-3">Similar Gift Ideas</h4>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {matchedGifts
                        .filter((g) => g.title !== gift.title && g.tags.some((t) => gift.tags.includes(t)))
                        .slice(0, 3)
                        .map((similarGift, idx) => (
                          <Card key={idx} className="overflow-hidden">
                            <div className="relative h-40">
                              <Image
                                src={similarGift.imageUrl || "/placeholder.svg"}
                                alt={similarGift.title}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium">
                                {similarGift.matchScore}% Match
                              </div>
                            </div>
                            <div className="p-3">
                              <h5 className="font-medium text-sm">{similarGift.title}</h5>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {similarGift.description}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-xs font-medium">${similarGift.priceRange}</p>
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="h-auto p-0 text-xs"
                                  onClick={() => handleBuyNow(similarGift.title)}
                                >
                                  Buy Now
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

