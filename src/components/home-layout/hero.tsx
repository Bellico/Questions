import SubscribeForm from "@/components/auth/subscribe-form";
import Link from "next/link";

export const HomeHero = () => (
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

          <SubscribeForm />

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
)

