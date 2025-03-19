"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Gift,
  Sparkles,
  User,
  Calendar,
  Users,
  Heart,
  Palette,
  DollarSign,
  Globe,
  Award,
  ThumbsUp,
  ThumbsDown,
  Info,
  Ban,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import GiftResultsOption3 from "@/components/gift-results-option3"

const formSchema = z.object({
  relationship: z.string().min(1, { message: "Please enter your relationship" }),
  occasion: z.string().min(1, { message: "Please enter the occasion" }),
  gender: z.string().min(1, { message: "Please select a gender" }),
  age: z.number().min(1).max(120),
  sharedHobbies: z.string().optional(),
  otherHobbies: z.string().optional(),
  values: z.string().optional(),
  budget: z.string().optional(),
  ethnicity: z.string().optional(),
  milestones: z.string().optional(),
  lovedGifts: z.string().optional(),
  excludeGifts: z.string().optional(),
  otherInfo: z.string().optional(),
  exclusions: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function FormOption3() {
  const [showResults, setShowResults] = useState(false)
  const [formData, setFormData] = useState<FormValues | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      relationship: "",
      occasion: "",
      gender: "",
      age: 30,
      sharedHobbies: "",
      otherHobbies: "",
      values: "",
      budget: "",
      ethnicity: "",
      milestones: "",
      lovedGifts: "",
      excludeGifts: "",
      otherInfo: "",
      exclusions: "",
    },
  })

  function onSubmit(values: FormValues) {
    setFormData(values)
    setShowResults(true)
  }

  if (showResults && formData) {
    return <GiftResultsOption3 formData={formData} onBack={() => setShowResults(false)} />
  }

  // Generate a pastel color based on the field name
  const getFieldColor = (fieldName: string) => {
    const colors = [
      "bg-pink-50 border-pink-200",
      "bg-blue-50 border-blue-200",
      "bg-green-50 border-green-200",
      "bg-purple-50 border-purple-200",
      "bg-yellow-50 border-yellow-200",
      "bg-indigo-50 border-indigo-200",
    ]
    const index = fieldName.length % colors.length
    return colors[index]
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
          Find the Perfect Gift
        </h1>
        <p className="mt-2 text-gray-600">
          Tell us about your recipient, and we'll suggest thoughtful gifts they'll love
        </p>
      </div>

      <Card className="overflow-hidden border-0 shadow-lg rounded-2xl bg-gradient-to-br from-white to-gray-50">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Tabs defaultValue="required" className="w-full">
                <TabsList className="grid w-full grid-cols-2 p-1 rounded-full bg-gray-100">
                  <TabsTrigger
                    value="required"
                    className="rounded-full data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm"
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    Required Info
                  </TabsTrigger>
                  <TabsTrigger
                    value="optional"
                    className="rounded-full data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Optional Details
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="required" className="pt-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="relationship"
                      render={({ field }) => (
                        <FormItem className={`p-4 rounded-xl border ${getFieldColor("relationship")}`}>
                          <FormLabel className="flex items-center text-base font-medium">
                            <User className="w-4 h-4 mr-2 text-purple-500" />
                            This is for my
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Sister, Friend, Colleague"
                              {...field}
                              className="border-0 bg-white/80 shadow-sm focus:ring-2 focus:ring-purple-500 rounded-lg"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="occasion"
                      render={({ field }) => (
                        <FormItem className={`p-4 rounded-xl border ${getFieldColor("occasion")}`}>
                          <FormLabel className="flex items-center text-base font-medium">
                            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                            Occasion
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Birthday, Anniversary, Christmas"
                              {...field}
                              className="border-0 bg-white/80 shadow-sm focus:ring-2 focus:ring-blue-500 rounded-lg"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem className={`p-4 rounded-xl border ${getFieldColor("gender")}`}>
                          <FormLabel className="flex items-center text-base font-medium">
                            <Users className="w-4 h-4 mr-2 text-green-500" />
                            Gender
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-0 bg-white/80 shadow-sm focus:ring-2 focus:ring-green-500 rounded-lg">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="non-binary">Non-binary</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem className={`p-4 rounded-xl border ${getFieldColor("age")}`}>
                          <div className="flex justify-between items-center">
                            <FormLabel className="flex items-center text-base font-medium">
                              <User className="w-4 h-4 mr-2 text-pink-500" />
                              Age
                            </FormLabel>
                            <span className="bg-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                              {field.value} years
                            </span>
                          </div>
                          <FormControl>
                            <Slider
                              min={1}
                              max={120}
                              step={1}
                              defaultValue={[field.value]}
                              onValueChange={(vals) => field.onChange(vals[0])}
                              className="py-4"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="optional" className="pt-6">
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="sharedHobbies"
                        render={({ field }) => (
                          <FormItem className={`p-4 rounded-xl border ${getFieldColor("sharedHobbies")}`}>
                            <FormLabel className="flex items-center text-base font-medium">
                              <Heart className="w-4 h-4 mr-2 text-red-500" />
                              Shared Hobbies
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Yoga, Reading, Hiking"
                                {...field}
                                className="border-0 bg-white/80 shadow-sm focus:ring-2 focus:ring-red-500 rounded-lg"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="otherHobbies"
                        render={({ field }) => (
                          <FormItem className={`p-4 rounded-xl border ${getFieldColor("otherHobbies")}`}>
                            <FormLabel className="flex items-center text-base font-medium">
                              <Palette className="w-4 h-4 mr-2 text-orange-500" />
                              Other Hobbies
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Gardening, Cooking, Art"
                                {...field}
                                className="border-0 bg-white/80 shadow-sm focus:ring-2 focus:ring-orange-500 rounded-lg"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="values"
                        render={({ field }) => (
                          <FormItem className={`p-4 rounded-xl border ${getFieldColor("values")}`}>
                            <FormLabel className="flex items-center text-base font-medium">
                              <Heart className="w-4 h-4 mr-2 text-purple-500" />
                              Values
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Sustainability, Family, Adventure"
                                {...field}
                                className="border-0 bg-white/80 shadow-sm focus:ring-2 focus:ring-purple-500 rounded-lg"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem className={`p-4 rounded-xl border ${getFieldColor("budget")}`}>
                            <FormLabel className="flex items-center text-base font-medium">
                              <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                              Max Budget
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. $50, $100, $200"
                                {...field}
                                className="border-0 bg-white/80 shadow-sm focus:ring-2 focus:ring-green-500 rounded-lg"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="ethnicity"
                        render={({ field }) => (
                          <FormItem className={`p-4 rounded-xl border ${getFieldColor("ethnicity")}`}>
                            <FormLabel className="flex items-center text-base font-medium">
                              <Globe className="w-4 h-4 mr-2 text-blue-500" />
                              Nationality or Religion
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Indian, Christian, Jewish"
                                {...field}
                                className="border-0 bg-white/80 shadow-sm focus:ring-2 focus:ring-blue-500 rounded-lg"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="milestones"
                        render={({ field }) => (
                          <FormItem className={`p-4 rounded-xl border ${getFieldColor("milestones")}`}>
                            <FormLabel className="flex items-center text-base font-medium">
                              <Award className="w-4 h-4 mr-2 text-yellow-500" />
                              Recent Life Milestones
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. New job, New home, New baby"
                                {...field}
                                className="border-0 bg-white/80 shadow-sm focus:ring-2 focus:ring-yellow-500 rounded-lg"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="lovedGifts"
                        render={({ field }) => (
                          <FormItem className={`p-4 rounded-xl border ${getFieldColor("lovedGifts")}`}>
                            <FormLabel className="flex items-center text-base font-medium">
                              <ThumbsUp className="w-4 h-4 mr-2 text-green-500" />
                              Previous Gifts They Loved
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Spa day, Cooking class"
                                {...field}
                                className="border-0 bg-white/80 shadow-sm focus:ring-2 focus:ring-green-500 rounded-lg"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="excludeGifts"
                        render={({ field }) => (
                          <FormItem className={`p-4 rounded-xl border ${getFieldColor("excludeGifts")}`}>
                            <FormLabel className="flex items-center text-base font-medium">
                              <ThumbsDown className="w-4 h-4 mr-2 text-red-500" />
                              Past Gifts to Exclude
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Jewelry, Books"
                                {...field}
                                className="border-0 bg-white/80 shadow-sm focus:ring-2 focus:ring-red-500 rounded-lg"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="otherInfo"
                        render={({ field }) => (
                          <FormItem className={`p-4 rounded-xl border ${getFieldColor("otherInfo")}`}>
                            <FormLabel className="flex items-center text-base font-medium">
                              <Info className="w-4 h-4 mr-2 text-blue-500" />
                              Other Information
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Any other details that might help us find the perfect gift"
                                {...field}
                                className="border-0 bg-white/80 shadow-sm focus:ring-2 focus:ring-blue-500 rounded-lg"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="exclusions"
                        render={({ field }) => (
                          <FormItem className={`p-4 rounded-xl border ${getFieldColor("exclusions")}`}>
                            <FormLabel className="flex items-center text-base font-medium">
                              <Ban className="w-4 h-4 mr-2 text-red-500" />
                              Other Exclusions
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Doesn't drink, Vegetarian"
                                {...field}
                                className="border-0 bg-white/80 shadow-sm focus:ring-2 focus:ring-red-500 rounded-lg"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="rounded-full px-8 py-6 gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  <Sparkles className="w-5 h-5" />
                  Find Magical Gifts
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="text-center mt-6 text-sm text-gray-500">
        <p>Coming soon: Link your texts, emails and social with the recipient for even better suggestions</p>
      </div>
    </div>
  )
}

