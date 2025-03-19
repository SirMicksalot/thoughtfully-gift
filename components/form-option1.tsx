"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import GiftResultsOption1 from "@/components/gift-results-option1"

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

export default function FormOption1() {
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
    return <GiftResultsOption1 formData={formData} onBack={() => setShowResults(false)} />
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-serif font-medium mb-3">Find the Perfect Gift</h1>
        <p className="text-muted-foreground">
          Tell us about your recipient, and we'll suggest thoughtful gifts they'll love
        </p>
      </div>

      <Card className="overflow-hidden border border-gray-200 rounded-xl shadow-sm">
        <CardContent className="p-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
              <div className="p-6 border-b border-gray-100 bg-gray-50">
                <h2 className="text-lg font-medium font-serif mb-4">Essential Information</h2>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="relationship"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">This is for my</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Sister, Friend, Colleague"
                            {...field}
                            className="rounded-lg border-gray-200 focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50"
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
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Occasion</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Birthday, Anniversary, Christmas"
                            {...field}
                            className="rounded-lg border-gray-200 focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50"
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
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="rounded-lg border-gray-200 focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50">
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
                        <FormLabel className="text-sm font-medium">Age: {field.value}</FormLabel>
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
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="optional" className="border-b-0">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50">
                    <span className="text-lg font-medium font-serif">Additional Details (Optional)</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="sharedHobbies"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Shared Hobbies</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. Yoga, Reading, Hiking"
                                  {...field}
                                  className="rounded-lg border-gray-200"
                                />
                              </FormControl>
                              <FormDescription className="text-xs">Hobbies you both enjoy</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="otherHobbies"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Other Hobbies</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. Gardening, Cooking, Art"
                                  {...field}
                                  className="rounded-lg border-gray-200"
                                />
                              </FormControl>
                              <FormDescription className="text-xs">Their other interests</FormDescription>
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
                              <FormLabel className="text-sm font-medium">Values</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. Sustainability, Family, Adventure"
                                  {...field}
                                  className="rounded-lg border-gray-200"
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
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Max Budget</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. $50, $100, $200"
                                  {...field}
                                  className="rounded-lg border-gray-200"
                                />
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
                              <FormLabel className="text-sm font-medium">Nationality or Religion</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. Indian, Christian, Jewish"
                                  {...field}
                                  className="rounded-lg border-gray-200"
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
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Recent Major Life Milestones</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. New job, New home, New baby"
                                  {...field}
                                  className="rounded-lg border-gray-200"
                                />
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
                              <FormLabel className="text-sm font-medium">Previous Gifts They Loved</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. Spa day, Cooking class"
                                  {...field}
                                  className="rounded-lg border-gray-200"
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
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Past Gifts to Exclude</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. Jewelry, Books"
                                  {...field}
                                  className="rounded-lg border-gray-200"
                                />
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
                              <FormLabel className="text-sm font-medium">Other Information</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Any other details that might help us find the perfect gift"
                                  {...field}
                                  className="rounded-lg border-gray-200"
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
                              <FormLabel className="text-sm font-medium">Other Exclusions</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. Doesn't drink, Vegetarian"
                                  {...field}
                                  className="rounded-lg border-gray-200"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <p className="text-xs text-muted-foreground">All fields marked with * are required</p>
                <Button
                  type="submit"
                  size="lg"
                  className="rounded-full px-6 gap-2 bg-black hover:bg-gray-800 text-white"
                >
                  Find Thoughtful Gifts
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="text-center mt-6 text-sm text-muted-foreground">
        <p>Coming soon: Link your texts, emails and social with the recipient for even better suggestions</p>
      </div>
    </div>
  )
}

