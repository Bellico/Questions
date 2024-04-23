'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { StepForward, Terminal, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export const AlertDraft = () => {
  const { t } = useTranslation('global')
  const [drafts, setDrafts] = useState<{ key: string, draftId: string, name: string }[]>([])

  useEffect(() => {
    const newDrafts = Object.keys(localStorage)
      .filter(k => k.endsWith('q-draft-editor'))
      .map(k => {
        const storage = localStorage.getItem(k)
        const data = JSON.parse(storage!).json.state

        return {
          key: k,
          draftId: data.id,
          name: data.name
        }
      })

    setDrafts(newDrafts)
  }, [])

  function deleteDraft(key: string) {
    localStorage.removeItem(key)
    setDrafts(drafts.filter(d => d.key !== key))
  }

  if (drafts.length === 0) return

  return (
    <>
      {drafts.map(draft => (
        <Alert className="my-4" key={draft.key}>
          <Terminal className="size-4" />
          <AlertTitle>
            {t('DraftUnsaved')} {' '}
            <span className="text-primary">({draft.name || 'New'})</span>
          </AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <p>{t('DraftUnsavedDesc')}</p>
            <div className='space-x-4'>
              <Button variant="destructive" onClick={() => deleteDraft(draft.key)}>
                <X className="mr-2 size-4" />
                {t('Delete')}
              </Button>
              <Link href={`/editor/${draft.draftId || ''}?useDraft=true`}>
                <Button variant="secondary">
                  <StepForward className="mr-2 size-4" />
                  {t('Continue')}
                </Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      ))}
    </>
  )
}
