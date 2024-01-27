export const Spinner = () => {
  return (
    <div className="flex items-center justify-center">
      <span className="spinner"></span>
    </div>
  )
}

export const SectionSpinner = ({ title }: { title?: string }) => {
  return (
    <section className="py-12">
      <div className="container">
        {title && (
          <h1 className="mb-12 text-center text-3xl font-semibold">{title}</h1>
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
