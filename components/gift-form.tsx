"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Sparkles } from 'lucide-react'
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import GiftResults from "@/components/gift-results"

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

export default function GiftForm() {
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
    return <GiftResults formData={formData} onBack={() => setShowResults(false)} />
  }

  return (
    <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-1">
      <Card className="overflow-hidden border-2 border-primary/20">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-2xl">Gift Recipient Information</CardTitle>
          <CardDescription>Tell us about the person you're shopping for</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Tabs defaultValue="required" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="required">Required Information</TabsTrigger>
                  <TabsTrigger value="optional">Optional Details</TabsTrigger>
                </TabsList>
                <TabsContent value="required" className="pt-4">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="relationship"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>This is for my</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Sister, Friend, Colleague" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="occasion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Occasion</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Birthday, Anniversary, Christmas" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
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
                        <FormItem>
                          <FormLabel>Age: {field.value}</FormLabel>
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
                <TabsContent value="optional" className="pt-4">
                  <div className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="sharedHobbies"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Shared Hobbies</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Yoga, Reading, Hiking" {...field} />
                            </FormControl>
                            <FormDescription>Hobbies you both enjoy</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="otherHobbies"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Other Hobbies</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Gardening, Cooking, Art" {...field} />
                            </FormControl>
                            <FormDescription>Their other interests</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="values"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Values</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Sustainability, Family, Adventure" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Budget</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. $50, $100, $200" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="ethnicity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nationality or Religion</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Indian, Christian, Jewish" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="milestones"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Recent Major Life Milestones</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. New job, New home, New baby" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="lovedGifts"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Previous Gifts They Loved</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Spa day, Cooking class" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="excludeGifts"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Past Gifts to Exclude</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Jewelry, Books" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="otherInfo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Other Information</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Any other details that might help us find the perfect gift"
                                {...field}
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
                          <FormItem>
                            <FormLabel>Other Exclusions</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Doesn't drink, Vegetarian" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <div className="flex justify-end">
                <Button type="submit" size="lg" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Find Thoughtful Gifts
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="bg-primary/5 px-6 py-4 text-sm text-muted-foreground flex justify-between items-center">
          <p>Coming soon: Link your texts, emails and social with the recipient for even better suggestions</p>
          <Link href="/design-options" className="text-primary hover:underline">
            View Design Options
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

