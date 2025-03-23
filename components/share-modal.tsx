"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  giftTheme: string
  giftDescription: string
  exampleProducts?: Array<{ name: string; price: string }>
  imageUrl?: string
}

export function ShareModal({
  isOpen,
  onClose,
  giftTheme,
  giftDescription,
  exampleProducts = [],
  imageUrl,
}: ShareModalProps) {
  const [email, setEmail] = useState("")
  const [senderName, setSenderName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [emailPreview, setEmailPreview] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setEmailPreview(null)

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      setIsSubmitting(false)
      return
    }

    try {
      // Always show the email preview in v0 environment
      // Generate email preview HTML
      const emailHtml = generateEmailHtml({
        giftTheme,
        giftDescription,
        exampleProducts,
        senderName: senderName.trim() || undefined,
        imageUrl,
        recipientEmail: email,
      })

      setEmailPreview(emailHtml)
      setSuccess(true)
      setIsSubmitting(false)
    } catch (err) {
      console.error("Error generating email preview:", err)
      setError("Failed to generate email preview. Please try again.")
      setIsSubmitting(false)
    }
  }

  // Function to generate email HTML for preview
  const generateEmailHtml = ({
    giftTheme,
    giftDescription,
    exampleProducts,
    senderName,
    imageUrl,
    recipientEmail,
  }: {
    giftTheme: string
    giftDescription: string
    exampleProducts: Array<{ name: string; price: string }>
    senderName?: string
    imageUrl?: string
    recipientEmail: string
  }) => {
    // Format example products for email
    const productsHtml =
      exampleProducts && exampleProducts.length > 0
        ? `
        <h3 style="margin-top: 20px; margin-bottom: 10px;">Example Products:</h3>
        <ul style="padding-left: 20px;">
          ${exampleProducts
            .map((product) => `<li>${product.name}${product.price ? ` - ${product.price}` : ""}</li>`)
            .join("")}
        </ul>
      `
        : ""

    // Default image if none provided
    const defaultImageUrl = `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(giftTheme)}`

    // Use provided image or default
    const finalImageUrl = imageUrl || defaultImageUrl

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #8b5cf6; margin-bottom: 5px;">Thoughtfully Gift</h1>
          ${
            senderName
              ? `<p style="margin-top: 0;">${senderName} thought you might like this gift idea:</p>`
              : '<p style="margin-top: 0;">Check out this gift idea:</p>'
          }
        </div>
        
        <div style="background-color: #f9f7ff; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${finalImageUrl}" alt="${giftTheme}" style="max-width: 100%; height: auto; border-radius: 8px; max-height: 300px; object-fit: cover;" />
          </div>
          <h2 style="color: #8b5cf6; margin-top: 0;">${giftTheme}</h2>
          <p>${giftDescription}</p>
          ${productsHtml}
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="#" 
             style="background-color: #8b5cf6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Discover More Gift Ideas
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #666;">
          <p>© ${new Date().getFullYear()} Thoughtfully Gift. All rights reserved.</p>
        </div>
      </div>
    `
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold text-lg">Share Gift Idea</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4">
          <div className="mb-4">
            {imageUrl && (
              <div className="mb-3 rounded-md overflow-hidden bg-gray-100">
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt={giftTheme}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    // Fallback to a reliable image if the provided one fails
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop"
                  }}
                />
              </div>
            )}
            <h4 className="font-medium">{giftTheme}</h4>
            <p className="text-sm text-gray-600 mt-1">{giftDescription}</p>
          </div>

          {success ? (
            <div className="space-y-4">
              <Alert className="bg-green-50 border-green-200 text-green-800 mb-4">
                <AlertDescription>Email preview generated!</AlertDescription>
              </Alert>

              {emailPreview && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Email Preview (would be sent to {email}):</p>
                  <div className="border rounded-md p-2 max-h-60 overflow-auto">
                    <div dangerouslySetInnerHTML={{ __html: emailPreview }} />
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button onClick={onClose}>Close</Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="senderName">Your Name (optional)</Label>
                  <Input
                    id="senderName"
                    type="text"
                    placeholder="Your name"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Recipient's Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="friend@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <Alert className="bg-red-50 border-red-200 text-red-800">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Generating Preview..." : "Preview Email"}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

