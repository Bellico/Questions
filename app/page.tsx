import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className="text-7xl text-center text-amber-600">Chargeur Induction Pliable</h1>
        <h2 className="text-6xl text-center text-amber-500">Chargeur sans Fil 3 en 1</h2>
        <br />
        <img src="/1.jpg" />
        <br />
        <img src="/2.jpg" />
        <br />
        <img src="/3.jpg" />
    </main>
  )
}
