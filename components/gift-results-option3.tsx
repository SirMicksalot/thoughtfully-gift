"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Gift, Heart, Share2, ShoppingBag, Sparkles, AlertCircle, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { calculateMatchScores } from "@/lib/match-calculator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ShareModal } from "@/components/share-modal"
import { useMobile } from "@/hooks/use-mobile"

// Updated interface to match the actual API response structure
interface GiftThemeItem {
  gift_theme: string
  gift_theme_description: string
  gift_theme_example_products: string
  match_score: number
  id: string
  theme_image_url?: string
}

interface ApiResponse {
  themes?: GiftThemeItem[]
  isMockData?: boolean
  [key: string]: any
}

interface GiftResultsProps {
  formData: any
  onBack: () => void
}

export default function GiftResultsOption3({ formData, onBack }: GiftResultsProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [giftThemes, setGiftThemes] = useState<GiftThemeItem[]>([])
  const [showingSimilar, setShowingSimilar] = useState<string | null>(null)
  const [savedGifts, setSavedGifts] = useState<string[]>([])
  const [usingMockData, setUsingMockData] = useState(false)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [selectedGiftForShare, setSelectedGiftForShare] = useState<GiftThemeItem | null>(null)
  const [dataLoaded, setDataLoaded] = useState(false)

  // Use a ref to track if we've already loaded data to prevent double-loading
  const dataLoadedRef = useRef(false)
  // Use a ref to track the current request to avoid race conditions
  const currentRequestRef = useRef<string | null>(null)

  const isMobile = useMobile()

  // Add this function to ensure all gift themes have IDs and image URLs
  const processGiftThemes = (themes: GiftThemeItem[]): GiftThemeItem[] => {
    return themes.map((theme, index) => {
      // Ensure each theme has an ID
      const id = theme.id || `generated-${Date.now()}-${index}`

      // Ensure theme has an image URL (even if it's undefined)
      const themeWithImage = {
        ...theme,
        id,
        theme_image_url: theme.theme_image_url || undefined,
      }

      return themeWithImage
    })
  }

  // Update the useEffect hook to handle network errors better
  useEffect(() => {
    let isMounted = true

    // Generate a unique request ID for this specific data fetch
    const requestId = `request-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    currentRequestRef.current = requestId

    async function loadGifts() {
      // If we've already loaded data, don't load again
      if (dataLoadedRef.current) return

      try {
        setLoading(true)
        setError(null)
        setUsingMockData(false)
        setImageErrors({})
        setDataLoaded(false)

        console.log(`[${requestId}] Starting gift data fetch`)

        // Get gifts with match scores
        const response = await calculateMatchScores(formData)

        // Check if this request is still the current one
        if (currentRequestRef.current !== requestId || !isMounted) {
          console.log(`[${requestId}] Request superseded or component unmounted, aborting`)
          return
        }

        console.log(`[${requestId}] Received API response:`, response)

        // Check if we're using mock data based on the explicit flag
        const isUsingMockData = !!response?.isMockData
        console.log(`[${requestId}] Using mock data: ${isUsingMockData}`)

        // Process the themes to ensure they all have IDs and image URLs
        let processedThemes: GiftThemeItem[] = []

        if (response && Array.isArray(response.themes)) {
          processedThemes = processGiftThemes(response.themes)
        } else if (response && Array.isArray(response)) {
          processedThemes = processGiftThemes(response)
        } else if (!response || (Array.isArray(response.themes) && response.themes.length === 0)) {
          setError("No gift suggestions found. Please try different criteria.")
          processedThemes = processGiftThemes(getMockGiftThemes().themes)
          setUsingMockData(true)
        } else {
          console.error(`[${requestId}] Unexpected API response format:`, response)
          setError("Received an unexpected response format from the API.")
          processedThemes = processGiftThemes(getMockGiftThemes().themes)
          setUsingMockData(true)
        }

        if (isMounted) {
          setGiftThemes(processedThemes)
          setUsingMockData(isUsingMockData)
          setDataLoaded(true)
          dataLoadedRef.current = true
          setLoading(false)
        }
      } catch (err) {
        console.error(`[${requestId}] Error loading gifts:`, err)

        if (isMounted) {
          setError("We couldn't connect to our gift suggestion service. Showing you some popular gift ideas instead.")
          setGiftThemes(processGiftThemes(getMockGiftThemes().themes))
          setUsingMockData(true)
          setDataLoaded(true)
          dataLoadedRef.current = true
          setLoading(false)
        }
      }
    }

    loadGifts()

    return () => {
      isMounted = false
    }
  }, [formData])

  const regenerateResults = async () => {
    // Reset the dataLoaded ref to allow loading new data
    dataLoadedRef.current = false

    // Generate a unique request ID for this specific data fetch
    const requestId = `request-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    currentRequestRef.current = requestId

    setLoading(true)
    setDataLoaded(false)

    try {
      // Add some randomness to the form data to get different results
      const randomizedFormData = {
        ...formData,
        _random: Math.random(), // Add a random value to force different results
      }

      console.log(`[${requestId}] Regenerating results with randomized form data`)

      const response = await calculateMatchScores(randomizedFormData)

      // Check if this request is still the current one
      if (currentRequestRef.current !== requestId) {
        console.log(`[${requestId}] Request superseded, aborting`)
        return
      }

      console.log(`[${requestId}] Received regenerated API response:`, response)

      // Check if we're using mock data based on the explicit flag
      const isUsingMockData = !!response?.isMockData
      console.log(`[${requestId}] Using mock data: ${isUsingMockData}`)

      // Process the themes to ensure they all have IDs and image URLs
      let processedThemes: GiftThemeItem[] = []

      if (response && Array.isArray(response.themes)) {
        processedThemes = processGiftThemes(response.themes)
        setError(null)
      } else if (response && Array.isArray(response)) {
        processedThemes = processGiftThemes(response)
        setError(null)
      } else {
        console.error(`[${requestId}] Unexpected API response format:`, response)
        setError("Received an unexpected response format from the API.")
        processedThemes = processGiftThemes(getMockGiftThemes().themes)
        setUsingMockData(true)
      }

      setGiftThemes(processedThemes)
      setUsingMockData(isUsingMockData)
      setImageErrors({})
      setDataLoaded(true)
    } catch (err) {
      console.error(`[${requestId}] Error regenerating results:`, err)
      setError("Failed to regenerate gift suggestions. Please try again later.")
      setGiftThemes(processGiftThemes(getMockGiftThemes().themes))
      setUsingMockData(true)
      setDataLoaded(true)
    } finally {
      setLoading(false)
    }
  }

  const handleBuyNow = (giftTheme: string) => {
    window.open(`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(giftTheme)}`, "_blank")
  }

  const handleMoreLikeThis = (giftId: string) => {
    setShowingSimilar(showingSimilar === giftId ? null : giftId)
  }

  // Update the handleShare function to remove any API calls
  const handleShare = (giftTheme: GiftThemeItem) => {
    setSelectedGiftForShare(giftTheme)

    if (isMobile) {
      // Use native share API on mobile
      if (navigator.share) {
        navigator
          .share({
            title: `Gift Idea: ${giftTheme.gift_theme}`,
            text: `Check out this gift idea: ${giftTheme.gift_theme} - ${giftTheme.gift_theme_description}`,
            url: window.location.href,
          })
          .catch((err) => {
            console.error("Error sharing:", err)
          })
      } else {
        // Fallback for mobile browsers that don't support the Share API
        setShareModalOpen(true)
      }
    } else {
      // Show email modal on desktop
      setShareModalOpen(true)
    }
  }

  const toggleSaveGift = (giftTheme: string) => {
    if (savedGifts.includes(giftTheme)) {
      setSavedGifts(savedGifts.filter((theme) => theme !== giftTheme))
    } else {
      setSavedGifts([...savedGifts, giftTheme])
    }
  }

  // Handle image error
  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({
      ...prev,
      [id]: true,
    }))
  }

  // Parse example products from string to array
  const parseExampleProducts = (exampleProductsStr: string): { name: string; price: string }[] => {
    if (!exampleProductsStr) return []

    try {
      const products: { name: string; price: string }[] = []

      // Check if the string contains numbered items (1., 2., etc.)
      if (/\d+\.\s/.test(exampleProductsStr)) {
        // Split by numbered items
        const items = exampleProductsStr.split(/\d+\.\s/).filter((item) => item.trim() !== "")

        items.forEach((item) => {
          const trimmedItem = item.trim()
          // Extract price in parentheses or with ~ symbol
          const priceMatch = trimmedItem.match(/$$([^)]+)$$/) || trimmedItem.match(/(~\$[0-9]+)/)
          const price = priceMatch ? priceMatch[1] : ""
          // Remove the price part to get just the name
          const name = priceMatch ? trimmedItem.replace(priceMatch[0], "").trim() : trimmedItem

          products.push({ name, price })
        })
      } else {
        // If no numbered items, try splitting by commas
        const items = exampleProductsStr
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)

        items.forEach((item) => {
          const trimmedItem = item.trim()
          // Extract price in parentheses or with ~ symbol
          const priceMatch = trimmedItem.match(/$$([^)]+)$$/) || trimmedItem.match(/(~\$[0-9]+)/)
          const price = priceMatch ? priceMatch[1] : ""
          // Remove the price part to get just the name
          const name = priceMatch ? trimmedItem.replace(priceMatch[0], "").trim() : trimmedItem

          products.push({ name, price })
        })
      }

      return products
    } catch (error) {
      console.error("Error parsing example products:", error)
      return []
    }
  }

  // Handle product click to search on Google Shopping
  const handleProductClick = (productName: string) => {
    window.open(`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(productName)}`, "_blank")
  }

  // Generate a pastel color based on the gift theme
  const getPastelColor = (theme: string) => {
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
    const index = theme.length % colors.length
    return colors[index]
  }

  // Extract tags from gift theme
  const extractTags = (theme: string): string[] => {
    // Split the theme into words and use them as tags
    return theme
      .split(/\s+/)
      .filter((word) => word.length > 3)
      .slice(0, 2)
  }

  // Update the getImageUrl function to handle null or undefined IDs
  const getImageUrl = (giftTheme: GiftThemeItem) => {
    // Define reliable fallback images that we know work
    const fallbackImages = [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519558260268-cde7e03a0152?w=800&auto=format&fit=crop",
    ]

    // First try the theme_image_url if it exists and hasn't errored
    if (giftTheme.theme_image_url && !imageErrors[giftTheme.id]) {
      return giftTheme.theme_image_url
    }

    // Use a deterministic fallback based on the gift theme ID if available
    if (giftTheme.id) {
      const idSum = giftTheme.id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)
      const fallbackIndex = idSum % fallbackImages.length
      return fallbackImages[fallbackIndex]
    }

    // If no ID is available, use a random fallback
    return fallbackImages[Math.floor(Math.random() * fallbackImages.length)]
  }

  // Add this function to the component
  function getMockGiftThemes() {
    return {
      isMockData: true,
      themes: [
        {
          gift_theme: "Personalized Jewelry",
          gift_theme_description:
            "Celebrate your sister's unique style and significance with personalized jewelry. This theme features custom engraved necklaces, bracelets, or rings that incorporate meaningful symbols or initials. Such pieces not only serve as a fashionable accessory but also as a constant reminder of the special bond you share.",
          gift_theme_example_products: "1. Engraved birthstone necklace (~$150). 2. Custom charm bracelet (~$120).",
          match_score: 85,
          id: "76fb8435-81a1-4e7a-b226-f1d75cc477cb",
          theme_image_url:
            "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop",
        },
        {
          gift_theme: "Luxury Experience Package",
          gift_theme_description:
            "Offer your sister a memorable day out with an exclusive experience. Whether she enjoys the tranquility of a spa, the sophistication of a wine tasting tour, or a gourmet dining adventure, an experience package tailors to making her birthday special and stress-free.",
          gift_theme_example_products: "1. Spa retreat voucher (~$200). 2. Wine tasting tour for two (~$180).",
          match_score: 80,
          id: "c4d01687-e7d9-47db-9c6a-f6a83c338089",
          theme_image_url:
            "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop",
        },
        {
          gift_theme: "Subscription Box",
          gift_theme_description:
            "Give the gift that keeps on giving with a subscription box tailored to her interests. From beauty products to books, gourmet snacks to craft supplies, subscription boxes offer a monthly reminder of your thoughtfulness and provide her with new discoveries to look forward to.",
          gift_theme_example_products:
            "1. 6-month beauty box subscription (~$150). 2. Monthly book club with wine pairing (~$180).",
          match_score: 75,
          id: "bdb9c9dd-efb5-4d3e-9732-a1bfc22f5247",
          theme_image_url:
            "https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=2215&auto=format&fit=crop",
        },
        {
          gift_theme: "Personalized Home Decor",
          gift_theme_description:
            "Help your sister make her living space uniquely hers with personalized home decor. From custom photo frames to monogrammed throw pillows, these items add a personal touch to her home while serving as a constant reminder of your thoughtful gift.",
          gift_theme_example_products:
            "1. Custom family photo canvas (~$100). 2. Personalized throw blanket with name or monogram (~$80).",
          match_score: 70,
          id: "0253a9d9-bdfd-4606-8748-3b537bec6c57",
          theme_image_url:
            "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop",
        },
        {
          gift_theme: "Tech Gadgets",
          gift_theme_description:
            "For the tech-savvy sister, the latest gadgets can make for an exciting and practical gift. From smart home devices to wireless earbuds, these gifts combine innovation with everyday utility to enhance her digital lifestyle.",
          gift_theme_example_products:
            "1. Wireless noise-canceling earbuds (~$150). 2. Smart speaker with voice assistant (~$100).",
          match_score: 65,
          id: "9bddc3b1-744e-475c-ab6e-6716ec17ba7c",
          theme_image_url:
            "https://images.unsplash.com/photo-1519558260268-cde7e03a0152?q=80&w=2070&auto=format&fit=crop",
        },
      ],
    }
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

      {/* Error display */}
      {error && dataLoaded && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Mock data notice */}
      {!loading && !error && usingMockData && dataLoaded && (
        <Alert className="bg-yellow-50 border-yellow-200 mb-4">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <AlertTitle className="text-yellow-800">Using Demo Data</AlertTitle>
          <AlertDescription className="text-yellow-700">
            The Python backend is currently unavailable. Showing demo gift suggestions instead.
          </AlertDescription>
        </Alert>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-purple-200 h-12 w-12"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-purple-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-purple-200 rounded"></div>
                <div className="h-4 bg-purple-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
          <p className="mt-4 text-gray-500">Finding the perfect gifts for you...</p>
          <p className="text-xs text-gray-400 mt-2">
            This may take up to 3 minutes as we search for personalized gift ideas.
          </p>
        </div>
      )}

      {/* Debug info - only visible in development */}
      {process.env.NODE_ENV === "development" && (
        <div className="bg-gray-100 p-4 rounded-lg mb-4 text-xs">
          <details>
            <summary className="font-bold cursor-pointer">Debug Information (click to expand)</summary>
            <div className="mt-2">
              <h4 className="font-semibold">Form Data:</h4>
              <pre className="bg-white p-2 rounded mt-1 overflow-auto max-h-40">
                {JSON.stringify(formData, null, 2)}
              </pre>

              <h4 className="font-semibold mt-3">API Response:</h4>
              <pre className="bg-white p-2 rounded mt-1 overflow-auto max-h-40">
                {JSON.stringify(giftThemes, null, 2)}
              </pre>

              <h4 className="font-semibold mt-3">Environment:</h4>
              <p>API URL: {process.env.NEXT_PUBLIC_PYTHON_API_URL || "Not set"}</p>
              <p>Using Mock Data: {usingMockData ? "Yes" : "No"}</p>
              <p>Is Mobile: {isMobile ? "Yes" : "No"}</p>
              <p>Data Loaded: {dataLoaded ? "Yes" : "No"}</p>
              <p>Current Request ID: {currentRequestRef.current}</p>
            </div>
          </details>
        </div>
      )}

      {/* Results display */}
      {!loading && !error && giftThemes.length > 0 && dataLoaded && (
        <div className="space-y-8">
          {giftThemes.map((giftTheme, index) => {
            const exampleProducts = parseExampleProducts(giftTheme.gift_theme_example_products)
            const tags = extractTags(giftTheme.gift_theme)
            const imageUrl = getImageUrl(giftTheme)

            return (
              <div key={giftTheme.id || index} className="space-y-4">
                <div
                  className={`rounded-2xl overflow-hidden shadow-lg border-2 border-gray-100 ${getPastelColor(giftTheme.gift_theme)}`}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Update the Image component rendering */}
                    <div className="md:w-2/5 relative bg-gray-100">
                      {/* Use a regular img tag instead of Next.js Image for more reliable loading */}
                      <img
                        src={imageUrl || "/placeholder.svg"}
                        alt={giftTheme.gift_theme}
                        className="h-full w-full object-cover"
                        onError={() => {
                          console.error(`Image failed to load: ${imageUrl}`)
                          handleImageError(giftTheme.id || `fallback-${index}`)
                        }}
                        style={{ minHeight: "250px" }}
                      />
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/30 to-transparent" />
                      <div className="absolute bottom-4 left-4 bg-white text-black px-3 py-1 rounded-full text-sm font-bold shadow-md">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-yellow-500" />
                          {giftTheme.match_score}% Match
                        </span>
                      </div>
                    </div>
                    <div className="md:w-3/5 p-6">
                      <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-bold">{giftTheme.gift_theme}</h3>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full h-8 w-8"
                            onClick={() => toggleSaveGift(giftTheme.gift_theme)}
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                savedGifts.includes(giftTheme.gift_theme) ? "fill-red-500 text-red-500" : ""
                              }`}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full h-8 w-8"
                            onClick={() => handleShare(giftTheme)}
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {tags.map((tag, i) => (
                          <Badge key={i} className="bg-white text-gray-800 border border-gray-200 hover:bg-gray-100">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <p className="text-gray-700 mt-4">{giftTheme.gift_theme_description}</p>

                      <div className="mt-6">
                        <h4 className="font-semibold text-sm mb-2">Example Products:</h4>
                        <ul className="list-disc pl-5 space-y-2 mb-4">
                          {exampleProducts.map((product, i) => (
                            <li key={i} className="text-sm">
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault()
                                  handleProductClick(product.name)
                                }}
                                className="text-blue-600 hover:underline hover:text-blue-800 flex justify-between"
                              >
                                <span>{product.name}</span>
                                {product.price && (
                                  <span className="font-semibold text-gray-700 ml-2">{product.price}</span>
                                )}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleBuyNow(giftTheme.gift_theme)}
                            className="bg-black hover:bg-gray-800 text-white"
                          >
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Shop Now
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleMoreLikeThis(giftTheme.id || `fallback-${index}`)}
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
                {showingSimilar === (giftTheme.id || `fallback-${index}`) && (
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                    {giftThemes
                      .filter(
                        (g) => (g.id || `fallback-${giftThemes.indexOf(g)}`) !== (giftTheme.id || `fallback-${index}`),
                      )
                      .slice(0, 3)
                      .map((similarTheme, similarIndex) => {
                        const similarExampleProducts = parseExampleProducts(similarTheme.gift_theme_example_products)
                        const similarImageUrl = getImageUrl(similarTheme)

                        return (
                          <div
                            key={similarTheme.id || `similar-${similarIndex}`}
                            className={`rounded-xl overflow-hidden shadow-md ${getPastelColor(similarTheme.gift_theme)}`}
                          >
                            <div className="relative bg-gray-100">
                              {/* Use regular img tag for similar items too */}
                              <img
                                src={similarImageUrl || "/placeholder.svg"}
                                alt={similarTheme.gift_theme}
                                className="w-full object-cover h-48"
                                onError={() => handleImageError(similarTheme.id || `similar-${similarIndex}`)}
                                style={{ minHeight: "150px" }}
                              />
                              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/30 to-transparent" />
                              <div className="absolute bottom-3 left-33 bg-white text-black px-2 py-1 rounded-full text-xs font-bold shadow-md">
                                <span className="flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-yellow-500" />
                                  {similarTheme.match_score}%
                                </span>
                              </div>
                            </div>
                            <div className="p-4">
                              <h5 className="font-bold">{similarTheme.gift_theme}</h5>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                {similarTheme.gift_theme_description}
                              </p>
                              {similarExampleProducts.length > 0 && (
                                <p className="text-xs font-medium mt-2">
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      handleProductClick(similarExampleProducts[0].name)
                                    }}
                                    className="text-blue-600 hover:underline hover:text-blue-800"
                                  >
                                    {similarExampleProducts[0].name}
                                  </a>
                                  {similarExampleProducts[0].price && (
                                    <span className="text-gray-700"> {similarExampleProducts[0].price}</span>
                                  )}
                                </p>
                              )}
                              <div className="flex items-center justify-between mt-3">
                                <Button
                                  size="sm"
                                  className="bg-black hover:bg-gray-800 text-white text-xs h-8 w-full"
                                  onClick={() => handleBuyNow(similarTheme.gift_theme)}
                                >
                                  <ShoppingBag className="w-3 h-3 mr-1" />
                                  Shop Now
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* No results state */}
      {!loading && !error && giftThemes.length === 0 && dataLoaded && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full p-6 inline-flex mb-4">
            <Gift className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">No Gift Suggestions Found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your criteria to get better gift suggestions.</p>
          <Button onClick={onBack} variant="outline">
            Update Preferences
          </Button>
        </div>
      )}

      {/* Share Modal */}
      {selectedGiftForShare && (
        <ShareModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          giftTheme={selectedGiftForShare.gift_theme}
          giftDescription={selectedGiftForShare.gift_theme_description}
          exampleProducts={parseExampleProducts(selectedGiftForShare.gift_theme_example_products)}
          imageUrl={getImageUrl(selectedGiftForShare)}
        />
      )}
    </div>
  )
}

