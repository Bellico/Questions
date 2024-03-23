import Link from 'next/link'

export const HomeFooter = () => (
  <footer className="absolute inset-x-0 bottom-0 py-6 text-xs text-gray-600">
    <div className="container px-6 text-center">
      <p>©{new Date().getFullYear()} <Link className="underline" href="https://github.com/Bellico/Questions">Bellico</Link></p>
    </div>
  </footer>
)
