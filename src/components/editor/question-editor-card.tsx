"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { QuestionSchema, QuestionType } from "@/lib/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

export function QuestionEditorCard({ id, subject, responses }: QuestionType) {

  const form = useForm<QuestionType>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: { subject, responses }
  })

  const { handleSubmit, register, setError, formState, } = form;

  return (
    <Card className="rounded-lg shadow-md my-7">
      <CardHeader className="p-4">
        <Label htmlFor="title-2" className="text-lg">Question 1</Label>
      </CardHeader>
      <CardContent className="p-4">
        <form className="space-y-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="description-1">Description</Label>
            <Textarea className="min-h-[100px]" id="description-1" placeholder="Enter description" {...register('subject')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="input-1">Input 1</Label>
            <Input id="input-1" placeholder="Enter input 1" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="input-2">Input 2</Label>
            <Input id="input-2" placeholder="Enter input 2" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="input-3">Input 3</Label>
            <Input id="input-3" placeholder="Enter input 3" />
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
