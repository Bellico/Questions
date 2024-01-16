export const Spinner = () => {
  return (
    <div className="flex items-center justify-center">
      <span className="spinner"></span>
    </div>
  )
}

export const SectionSpinner = ({ title }: { title: string }) => {
  return (
    <section className="py-12">
      <div className="container mx-auto">
        <h1 className="text-3xl mb-12 text-center font-semibold">{title}</h1>
        <Spinner />
      </div>
    </section>
  )
}

export const OverloadSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-slate-100/75 dark:bg-black/75">
      <span className="spinner page-spinner"></span>
    </div>
  )
}
