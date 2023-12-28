import Link from "next/link"

export const HomeFooter = () => (
  <footer className="absolute left-0 right-0 bottom-0 py-6 text-gray-600 text-xs">
    <div className="container mx-auto px-6 text-center">
      <p>© 2023 Questions App by <Link className="underline" href="https://github.com/Bellico?tab=repositories">Bellico Github</Link></p>
      <p>Powered by <Link className="underline" href="https://vercel.com/">Vercel</Link></p>
    </div>
  </footer>
)
