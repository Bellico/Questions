'use client'

import { OverloadSpinner } from '@/components/commons/spinner'
import { useLoader } from '@/hooks/useLoader'

export function Loader() {
  const {loading } = useLoader()

  if(loading) return <OverloadSpinner />
  else null
}
