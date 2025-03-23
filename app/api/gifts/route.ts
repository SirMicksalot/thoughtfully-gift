import { type NextRequest, NextResponse } from "next/server"

// Set maxDuration for Vercel functions to extend timeout
// Vercel only allows values between 1 and 60 seconds
export const maxDuration = 60 // Set to maximum allowed value (60 seconds)

// Maximum time to wait for the API response (in milliseconds)
// Reducing this to 50 seconds to ensure we have time to process the response
const API_TIMEOUT = 50000 // 50 seconds

// Number of initial attempts before showing a loading indicator
const INITIAL_ATTEMPTS = 2

export async function GET(request: NextRequest) {
  try {
    // Get the search params from the request URL
    const searchParams = request.nextUrl.searchParams

    // Get the API URL from environment variables
    const apiUrl = process.env.PYTHON_API_URL || "https://gitfting-assistant-4da08ab3377f.herokuapp.com/api/gifts"

    // Construct the URL with search params
    const urlWithParams = `${apiUrl}?${searchParams.toString()}`

    console.log("Proxying request to:", urlWithParams)

    // Try to get a direct response first with a short timeout
    try {
      const directResponse = await fetch(urlWithParams, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          // Add cache-busting headers
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        signal: AbortSignal.timeout(6000), // 6 second timeout for direct attempt (reduced from 8 seconds)
        cache: "no-store",
      }).catch((error) => {
        console.error("Direct fetch error:", error.message || error)
        return null // Return null to indicate fetch failed
      })

      if (directResponse && directResponse.ok) {
        const contentType = directResponse.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const data = await directResponse.json()
          console.log("Got direct response from API")

          // If the data is already in the correct format (with a themes array), return it as is
          if (data && Array.isArray(data.themes)) {
            return NextResponse.json(data, {
              headers: {
                "Cache-Control": "no-cache, no-store, must-revalidate",
                Pragma: "no-cache",
                Expires: "0",
              },
            })
          }
          // If the data is an array, wrap it in a themes object
          else if (data && Array.isArray(data)) {
            return NextResponse.json(
              { themes: data },
              {
                headers: {
                  "Cache-Control": "no-cache, no-store, must-revalidate",
                  Pragma: "no-cache",
                  Expires: "0",
                },
              },
            )
          }
          // Otherwise, return the data as is
          return NextResponse.json(data, {
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
          })
        }
      }
      // If direct attempt fails, continue with polling strategy
      console.log("Direct attempt failed, falling back to polling strategy")
    } catch (directError) {
      console.log("Direct attempt error:", directError.message)
      // Continue with polling strategy
    }

    // Implement a polling strategy with timeout
    const startTime = Date.now()
    let apiResponse = null
    let lastError = null
    let attemptCount = 0

    // Keep trying until we get a response or timeout
    while (Date.now() - startTime < API_TIMEOUT) {
      attemptCount++

      // Add unique identifiers to prevent caching
      const timestamp = Date.now()
      const random = Math.random().toString(36).substring(2, 15)
      const uniqueUrl = `${urlWithParams}&_t=${timestamp}&_r=${random}`

      try {
        console.log(`Polling attempt ${attemptCount} at ${new Date().toISOString()}`)

        // Make the request to the Python backend with a shorter timeout for each attempt
        const response = await fetch(uniqueUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            // Add a cache-busting header to prevent caching
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
            // Add a custom header to identify the request
            "X-Request-ID": `${timestamp}-${random}`,
          },
          // Use a shorter timeout for each attempt
          signal: AbortSignal.timeout(10000), // 10 seconds per attempt (reduced from 15)
          // Disable keep-alive to prevent connection pooling issues
          cache: "no-store",
        }).catch((error) => {
          console.error(`Fetch error in attempt ${attemptCount}:`, error.message || error)
          throw error // Re-throw to be caught by the outer catch block
        })

        // If we get a 503 (service unavailable) or 504 (gateway timeout), we'll retry
        if (response.status === 503 || response.status === 504) {
          console.log(`Received ${response.status}, retrying... (attempt ${attemptCount})`)
          // Wait a bit before retrying, increasing the wait time with each attempt
          await new Promise((resolve) => setTimeout(resolve, Math.min(1000 + attemptCount * 300, 3000)))
          continue
        }

        // For other non-OK responses, throw an error
        if (!response.ok) {
          console.error(`API error: ${response.status}`)
          throw new Error(`API returned status ${response.status}`)
        }

        // Check content type
        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          console.error(`Invalid content type: ${contentType}`)
          throw new Error(`Invalid content type: ${contentType}`)
        }

        // Try to parse the response as JSON
        const data = await response.json()
        console.log(`Received data from attempt ${attemptCount}:`, JSON.stringify(data).substring(0, 200) + "...")
        apiResponse = data
        break // Exit the loop if we got a valid response
      } catch (error) {
        lastError = error
        console.log(`Attempt ${attemptCount} failed: ${error.message}, retrying...`)

        // Wait a bit before retrying, increasing the wait time with each attempt
        await new Promise((resolve) => setTimeout(resolve, Math.min(1000 + attemptCount * 300, 3000)))

        // After several attempts, return a special "still loading" response
        if (attemptCount >= INITIAL_ATTEMPTS && attemptCount % 2 === 0) {
          // Every other attempt after the initial ones, send a "still loading" status
          // This keeps the connection alive and lets the client know we're still trying
          return NextResponse.json(
            {
              status: "loading",
              message: "The API request is still processing. Please wait...",
              attempt: attemptCount,
              elapsed: Math.floor((Date.now() - startTime) / 1000),
            },
            {
              status: 202, // Accepted but still processing
              headers: {
                "Content-Type": "application/json",
                // Add cache control headers to prevent caching
                "Cache-Control": "no-cache, no-store, must-revalidate",
                Pragma: "no-cache",
                Expires: "0",
              },
            },
          )
        }
      }

      // Check if we're about to timeout and return mock data early
      if (Date.now() - startTime > API_TIMEOUT - 5000) {
        console.log("Approaching timeout limit, returning mock data early")
        return NextResponse.json(getMockGiftThemes(), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        })
      }
    }

    // If we got a response, return it
    if (apiResponse) {
      console.log("Returning successful API response")

      // Log the structure of the response to help debug missing fields
      if (process.env.NODE_ENV === "development") {
        const sampleTheme = Array.isArray(apiResponse.themes)
          ? apiResponse.themes[0]
          : Array.isArray(apiResponse)
            ? apiResponse[0]
            : null
        if (sampleTheme) {
          console.log("Sample theme structure:", Object.keys(sampleTheme))
          console.log("Sample theme ID:", sampleTheme.id)
          console.log("Sample theme image URL:", sampleTheme.theme_image_url)
        }
      }

      // If the data is already in the correct format (with a themes array), return it as is
      if (apiResponse && Array.isArray(apiResponse.themes)) {
        return NextResponse.json(apiResponse, {
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        })
      }
      // If the data is an array, wrap it in a themes object
      else if (apiResponse && Array.isArray(apiResponse)) {
        return NextResponse.json(
          { themes: apiResponse },
          {
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
          },
        )
      }
      // Otherwise, return the data as is
      return NextResponse.json(apiResponse, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })
    }

    // If we timed out without getting a response, return mock data
    console.error("API request timed out after", API_TIMEOUT, "ms")
    console.log("Returning mock data due to timeout")
    return NextResponse.json(getMockGiftThemes(), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error("Error in gifts API route:", error)

    // Return mock data in case of any error
    console.log("Returning mock data due to general error")
    return NextResponse.json(getMockGiftThemes(), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  }
}

// Mock data for when the API is unavailable
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

