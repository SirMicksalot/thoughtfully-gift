export async function calculateMatchScores(formData: any) {
  try {
    // Create a mapping from form field names to API query parameter names
    const paramMapping: Record<string, string> = {
      age: "age",
      gender: "gender",
      occasion: "occasion",
      relationship: "relationship",
      sharedHobbies: "shared_hobbies",
      otherHobbies: "other_hobbies",
      values: "values",
      ethnicity: "culture",
      milestones: "milestones",
      lovedGifts: "past_gifts_loved",
      excludeGifts: "past_gifts_exclude",
      otherInfo: "other_info",
      exclusions: "other_exclude",
      budget: "budget",
    }

    // Convert form data to query parameters with the correct parameter names
    const queryParams = new URLSearchParams()

    // Add all form fields to query parameters using the mapping
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        const apiParamName = paramMapping[key] || key
        queryParams.append(apiParamName, String(value))
      }
    })

    // Base URL for the API
    const apiUrl = "/api/gifts"

    // Add timestamp to URL to prevent caching
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 15)
    const urlWithParams = `${apiUrl}?${queryParams.toString()}&_t=${timestamp}&_r=${random}`

    console.log("Fetching gift suggestions from:", urlWithParams)

    // Make a single fetch request with a reasonable timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 25000) // 25 second timeout

    try {
      const response = await fetch(urlWithParams, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        signal: controller.signal,
        cache: "no-store",
      })

      // Clear the timeout since the request completed
      clearTimeout(timeoutId)

      if (!response.ok) {
        console.error(`API error: ${response.status}`)
        throw new Error(`API returned status ${response.status}`)
      }

      const data = await response.json()

      // Check if the response contains a loading status
      if (data.status === "loading") {
        console.log("API is still processing, returning mock data for now")
        return getMockGiftThemes()
      }

      // Log the received data
      console.log("Received API response:", data)

      // If the data already has the isMockData flag, respect it
      if (data.isMockData !== undefined) {
        return data
      }

      // If the data has themes array, it's valid data from the API
      if (data && Array.isArray(data.themes) && data.themes.length > 0) {
        // Explicitly mark as NOT mock data
        return {
          ...data,
          isMockData: false,
        }
      }
      // If the data is an array directly, wrap it and mark as NOT mock data
      else if (data && Array.isArray(data) && data.length > 0) {
        return {
          themes: data,
          isMockData: false,
        }
      }

      // If we got here, the data format is unexpected or empty
      console.error("Unexpected API response format or empty data:", data)
      return getMockGiftThemes()
    } catch (error) {
      // Clear the timeout if there was an error
      clearTimeout(timeoutId)

      console.error("Error fetching gift suggestions:", error)

      // If it's a network error or timeout, return mock data
      return getMockGiftThemes()
    }
  } catch (error) {
    console.error("Error in calculateMatchScores:", error)
    return getMockGiftThemes()
  }
}

// Add this function to provide mock data when the API is unavailable
function getMockGiftThemes() {
  return {
    isMockData: true, // Add this flag to indicate mock data
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

