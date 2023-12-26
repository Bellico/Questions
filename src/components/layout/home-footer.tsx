import Link from "next/link"

export const HomeFooter = () => (
    <footer className="bg-gray-200 py-6">
        <div className="container mx-auto px-6 text-center text-gray-600">
            <p>© 2023 Questions App by <Link className="underline" href="https://github.com/Bellico?tab=repositories">Bellico Github</Link></p>
            <p>Powered by <Link className="underline" href="https://vercel.com/">Vercel</Link></p>
        </div>
    </footer>
)

