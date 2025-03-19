"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import GiftResultsOption2 from "@/components/gift-results-option2"

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

export default function FormOption2() {
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
    return <GiftResultsOption2 formData={formData} onBack={() => setShowResults(false)} />
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-5xl font-bold tracking-tight uppercase mb-4">GIFT FINDER</h1>
        <p className="text-xl">Complete the form below to discover the perfect gift</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
          <div>
            <h2 className="text-2xl font-bold tracking-tight uppercase mb-6">REQUIRED INFORMATION</h2>
            <div className="grid gap-8 md:grid-cols-2">
              <FormField
                control={form.control}
                name="relationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold uppercase">This is for my *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Sister, Friend, Colleague"
                        {...field}
                        className="rounded-none border-black h-12 text-lg"
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
                    <FormLabel className="text-base font-bold uppercase">Occasion *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Birthday, Anniversary, Christmas"
                        {...field}
                        className="rounded-none border-black h-12 text-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-8 md:grid-cols-2 mt-8">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold uppercase">Gender *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-none border-black h-12 text-lg">
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
                    <div className="flex justify-between">
                      <FormLabel className="text-base font-bold uppercase">Age *</FormLabel>
                      <span className="text-xl font-bold">{field.value}</span>
                    </div>
                    <FormControl>
                      <Slider
                        min={1}
                        max={120}
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                        className="py-6"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator className="border-t-2 border-black" />

          <div>
            <h2 className="text-2xl font-bold tracking-tight uppercase mb-6">OPTIONAL DETAILS</h2>

            <div className="grid gap-8 md:grid-cols-2">
              <FormField
                control={form.control}
                name="sharedHobbies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold uppercase">Shared Hobbies</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Yoga, Reading, Hiking"
                        {...field}
                        className="rounded-none border-black h-12 text-lg"
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
                  <FormItem>
                    <FormLabel className="text-base font-bold uppercase">Other Hobbies</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Gardening, Cooking, Art"
                        {...field}
                        className="rounded-none border-black h-12 text-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-8 md:grid-cols-2 mt-8">
              <FormField
                control={form.control}
                name="values"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold uppercase">Values</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Sustainability, Family, Adventure"
                        {...field}
                        className="rounded-none border-black h-12 text-lg"
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
                    <FormLabel className="text-base font-bold uppercase">Max Budget</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. $50, $100, $200"
                        {...field}
                        className="rounded-none border-black h-12 text-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-8 md:grid-cols-2 mt-8">
              <FormField
                control={form.control}
                name="ethnicity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold uppercase">Nationality or Religion</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Indian, Christian, Jewish"
                        {...field}
                        className="rounded-none border-black h-12 text-lg"
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
                    <FormLabel className="text-base font-bold uppercase">Recent Life Milestones</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. New job, New home, New baby"
                        {...field}
                        className="rounded-none border-black h-12 text-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-8 md:grid-cols-2 mt-8">
              <FormField
                control={form.control}
                name="lovedGifts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold uppercase">Previous Gifts They Loved</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Spa day, Cooking class"
                        {...field}
                        className="rounded-none border-black h-12 text-lg"
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
                    <FormLabel className="text-base font-bold uppercase">Past Gifts to Exclude</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Jewelry, Books"
                        {...field}
                        className="rounded-none border-black h-12 text-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-8 md:grid-cols-2 mt-8">
              <FormField
                control={form.control}
                name="otherInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold uppercase">Other Information</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any other details that might help us find the perfect gift"
                        {...field}
                        className="rounded-none border-black text-lg min-h-[120px]"
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
                    <FormLabel className="text-base font-bold uppercase">Other Exclusions</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Doesn't drink, Vegetarian"
                        {...field}
                        className="rounded-none border-black h-12 text-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm">* Required fields</p>
            <Button
              type="submit"
              size="lg"
              className="rounded-none bg-black hover:bg-gray-800 text-white h-14 px-8 text-lg"
            >
              FIND GIFTS
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </form>
      </Form>

      <div className="mt-8 text-sm border-t-2 border-black pt-4">
        <p>Coming soon: Link your texts, emails and social with the recipient for even better suggestions</p>
      </div>
    </div>
  )
}

