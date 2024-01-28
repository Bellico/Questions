import { cn } from '@/lib/utils'

export const Spinner = () => {
  return (
    <div className="flex items-center justify-center">
      <span className="spinner"></span>
    </div>
  )
}

export const SectionSpinner = ({ title, className}: { title?: string, className?: string }) => {
  return (
    <section className={cn('py-12', className)}>
      <div className="container">
        {title && (
          <h1 className="mb-12 text-center text-5xl font-extrabold">
            {title}
          </h1>
        )}
        <Spinner />
      </div>
    </section>
  )
}

export const OverloadSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-100/75 dark:bg-black/75">
      <span className="spinner page-spinner"></span>
    </div>
  )
}

export const MainSpinner = () => {
  return (
    <main className="fixed inset-0 z-50 flex items-center justify-center">
      <span className="spinner page-spinner"></span>
    </main>
  )
}
