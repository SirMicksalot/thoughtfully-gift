import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { recipientEmail, giftTheme, giftDescription, exampleProducts, senderName, imageUrl } = await request.json()

    // Validate inputs
    if (!recipientEmail || !giftTheme) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In v0 preview, we'll just return a success response without actually sending an email
    return NextResponse.json({
      success: true,
      message: "Email preview generated successfully",
      // This is a dummy preview URL that won't actually work
      previewUrl: null,
    })
  } catch (error) {
    console.error("Error in share API route:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}

