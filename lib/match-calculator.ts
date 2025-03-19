import { giftSuggestions } from "./gift-data"

// Calculate a match score based on form data
export function calculateMatchScores(formData: any) {
  return giftSuggestions
    .map((gift) => {
      let adjustedScore = gift.baseMatchScore

      // Adjust score based on form data
      // Gender match
      if (formData.gender && gift.forGender && gift.forGender.includes(formData.gender)) {
        adjustedScore += 3
      }

      // Age match - closer to the middle of the range is better
      const ageRange = gift.maxAge - gift.minAge
      const middleAge = gift.minAge + ageRange / 2
      const ageDiff = Math.abs(formData.age - middleAge)
      const ageMatchPercentage = 1 - ageDiff / (ageRange / 2)
      adjustedScore += ageMatchPercentage * 5

      // Hobbies match
      if (formData.sharedHobbies) {
        const hobbies = formData.sharedHobbies
          .toLowerCase()
          .split(",")
          .map((h: string) => h.trim())
        const tagMatches = gift.tags.filter((tag) =>
          hobbies.some((hobby) => tag.toLowerCase().includes(hobby) || hobby.includes(tag.toLowerCase())),
        )
        adjustedScore += tagMatches.length * 2
      }

      if (formData.otherHobbies) {
        const hobbies = formData.otherHobbies
          .toLowerCase()
          .split(",")
          .map((h: string) => h.trim())
        const tagMatches = gift.tags.filter((tag) =>
          hobbies.some((hobby) => tag.toLowerCase().includes(hobby) || hobby.includes(tag.toLowerCase())),
        )
        adjustedScore += tagMatches.length * 1.5
      }

      // Values match
      if (formData.values) {
        const values = formData.values
          .toLowerCase()
          .split(",")
          .map((v: string) => v.trim())
        const tagMatches = gift.tags.filter((tag) =>
          values.some((value) => tag.toLowerCase().includes(value) || value.includes(tag.toLowerCase())),
        )
        adjustedScore += tagMatches.length * 2
      }

      // Budget match
      if (formData.budget) {
        const budget = Number.parseInt(formData.budget.replace(/[^0-9]/g, ""))
        if (!isNaN(budget)) {
          const giftPriceAvg =
            (Number.parseInt(gift.priceRange.split("-")[0]) + Number.parseInt(gift.priceRange.split("-")[1])) / 2
          if (giftPriceAvg <= budget) {
            adjustedScore += 3
          } else {
            adjustedScore -= 5
          }
        }
      }

      // Ensure score is between 0-100
      return {
        ...gift,
        matchScore: Math.min(100, Math.max(0, Math.round(adjustedScore))),
      }
    })
    .sort((a, b) => b.matchScore - a.matchScore) // Sort by match score
}

