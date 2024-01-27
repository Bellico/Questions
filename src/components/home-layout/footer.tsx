import Link from 'next/link'

export const HomeFooter = () => (
  <footer className="absolute inset-x-0 bottom-0 py-6 text-xs text-gray-600">
    <div className="container px-6 text-center">
      <p>© 2024 Questions App by <Link className="underline" href="https://github.com/Bellico?tab=repositories">Bellico Github</Link></p>
      <p>Powered by <Link className="underline" href="https://vercel.com/">Vercel</Link></p>
    </div>
  </footer>
)
