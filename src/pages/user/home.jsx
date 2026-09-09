import React, { useState } from 'react'
import { ShieldCheck,Truck,RotateCcw,Headphones,ArrowRight,ArrowLeft,ChevronLeft,ChevronRight } from 'lucide-react'

const trustBadges = [
  { icon: ShieldCheck, title: "100% Authentic", subtitle: "Original watches only" },
  { icon: Truck, title: "Free Shipping", subtitle: "On all orders above $99" },
  { icon: RotateCcw, title: "Easy Returns", subtitle: "30-day return policy" },
  { icon: Headphones, title: "24/7 Support", subtitle: "We're here to help" },
];

const categories = [
  { name: "Men's Watches", image: "https://placehold.co/400x400/e7e3dc/1a1a1a?text=Men%27s+Watch" },
  { name: "Women's Watches", image: "https://placehold.co/400x400/efe6da/1a1a1a?text=Women%27s+Watch" },
  { name: "Smart Watches", image: "https://placehold.co/400x400/dcdcdc/1a1a1a?text=Smart+Watch" },
  { name: "Casual Watches", image: "https://placehold.co/400x400/e3ded2/1a1a1a?text=Casual+Watch" },
  { name: "Premium Watches", image: "https://placehold.co/400x400/d9d9d9/1a1a1a?text=Premium+Watch" },
];

const Home = () => {

  const [slide, setSlide] = useState(1);

  const totalSlides = 3;

  const nextSlide = () => setSlide((s) => (s % totalSlides) + 1);
  const prevSlide = () => setSlide((s) => ((s - 2 + totalSlides) % totalSlides) + 1);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">

      {/* Hero */}

      <section className="relative bg-gradient-to-br from-stone-100 to-stone-200 overflow-hidden">
        <div className="grid md:grid-cols-2 items-center gap-8 px-6 md:px-16 py-16 md:py-24 max-w-7xl mx-auto">
          <div className="max-w-md">
            <p className="text-xs tracking-[0.2em] text-gray-500 mb-4">TIMELESS ELEGANCE</p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
              More Than Just
              <br />a Watch
            </h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Crafted for those who value style, precision and every moment.
            </p>
            <button className="inline-flex items-center gap-2 rounded-md bg-gray-900 text-white px-6 py-3 text-sm font-medium hover:bg-gray-800 transition-colors">
              Shop Now
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <img
              src="https://placehold.co/600x500/f0ede6/1a1a1a?text=Featured+Watch"
              alt="Featured Velora watch"
              className="w-full max-w-lg rounded-xl object-cover shadow-xl"
            />
          </div>
        </div>

        <div className="absolute bottom-6 right-6 md:right-16 flex items-center gap-3 text-sm text-gray-500">
          <span>0{slide} / 0{totalSlides}</span>
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 hover:bg-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 hover:bg-white transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Trust badges */}

      <section className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
          {trustBadges.map(({ icon: Icon, title, subtitle }) => (
            <div key={title} className="flex items-center gap-4 px-6 md:px-10 py-8">
              <Icon className="h-6 w-6 text-gray-800 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">{title}</p>
                <p className="text-xs text-gray-500">{subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured collection */}
      
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs tracking-[0.2em] text-gray-400 mb-2">FEATURED COLLECTION</p>
            <h2 className="text-3xl font-bold">Find Your Perfect Watch</h2>
          </div>
          <button className="hidden sm:flex items-center gap-1 text-sm font-medium text-gray-800 hover:text-gray-600">
            View All
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className="group text-left rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home