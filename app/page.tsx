import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <p className="underline">Je ne peux pas te présenter en réel le cadeau du à un retard de colis. Mais permets moi de te l'offrir numériquement pour le moment.</p>
        <br />
        <br />

        <h1 className="text-3xl text-amber-600">Chargeur Induction Pliable</h1>
        <h2 className="text-2xl text-amber-500">Chargeur sans Fil 3 en 1</h2>
        <br />
        <img src="/1.jpg" />
        <br />
        <img src="/2.jpg" />
        <br />
        <img src="/3.jpg" />
    </main>
  )
}
