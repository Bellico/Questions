"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { StepForward, Terminal } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export const AlertDraft = () => {
  const [hasDraft, setHasDraft] = useState(false)
  let draftId = useRef<string | undefined>(undefined)

  useEffect(() => {
    const storage = localStorage.getItem('q-editor')
    if (!storage) return

    draftId.current = JSON.parse(storage).json.state.id
    setHasDraft(true)
  }, [])

  if (!hasDraft) return

  return (
    <div className="container">
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Draft not saved !</AlertTitle>
        <AlertDescription className="flex justify-between items-center">
          <p>
            A current draft has not been saved you can continue it.
          </p>
          <Link href={`/editor/${draftId.current || ''}?useDraft=true`}>
            <Button variant="secondary"><StepForward className="mr-2 h-4 w-4" />Continue</Button>
          </Link>
        </AlertDescription >
      </Alert >
    </div >
  )
}
