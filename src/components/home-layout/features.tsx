import { FlagIcon } from "lucide-react";

export const HomeFeatures = () => (
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
)

