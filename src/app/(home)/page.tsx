import { HomeFooter } from "@/components/layout/home-footer"
import { HomeHeader } from "@/components/layout/home-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FlagIcon } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <>
      <HomeHeader />
      <main>
        <section className="w-full h-screen py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6 h-full flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Welcome to your questions editor
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Sign up to discover.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input className="max-w-lg flex-1" placeholder="Enter your email" type="email" />
                  <Button type="submit">Subscribe</Button>
                </form>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  For more informations &nbsp;
                  <Link className="underline underline-offset-2" href="#">
                    See here.
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gray-100">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl text-center mb-12">
              Our Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex flex-col items-center space-y-4 text-center">
                <FlagIcon className="w-8 h-8" />
                <h3 className="text-xl font-bold">Feature 1</h3>
                <p className="text-gray-500">Description of Feature 1</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <FlagIcon className="w-8 h-8" />
                <h3 className="text-xl font-bold">Feature 2</h3>
                <p className="text-gray-500">Description of Feature 2</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <FlagIcon className="w-8 h-8" />
                <h3 className="text-xl font-bold">Feature 3</h3>
                <p className="text-gray-500">Description of Feature 3</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <HomeFooter />
    </>
  )
}
