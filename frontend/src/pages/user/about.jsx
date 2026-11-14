import React from "react";
import { Clock, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
const About = () => {
  return (
    <div className="min-h-screen bg-white">

      {/* HERO SECTION */}
      <section className="px-6 md:px-10 lg:px-[8%] pt-16 pb-20">
        <div className="max-w-3xl">
          <p className="text-sm tracking-[0.3em] text-gray-500">
            ABOUT VELORA
          </p>

          <h1 className="mt-4 text-4xl md:text-6xl font-semibold text-gray-900 leading-tight">
            Time, designed with purpose.
          </h1>

          <p className="mt-6 text-base md:text-lg leading-8 text-gray-600">
            VELORA brings together timeless design and modern watchmaking
            to create watches that fit effortlessly into everyday life.
          </p>
        </div>
      </section>

      {/* STORY SECTION */}
      <section className="border-t border-gray-100 px-6 md:px-10 lg:px-[8%] py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          <div>
            <p className="text-sm tracking-[0.3em] text-gray-500">
              OUR STORY
            </p>

            <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-gray-900">
              Watches made for every moment.
            </h2>
          </div>

          <div>
            <p className="text-gray-600 leading-8">
              At VELORA, we believe a watch is more than something that
              tells time. It is part of your style, your routine, and the
              moments you remember.
            </p>

            <p className="mt-5 text-gray-600 leading-8">
              Our collection brings together carefully selected designs
              for different occasions, from everyday casual styles to
              watches made for an active lifestyle.
            </p>
          </div>

        </div>
      </section>

      {/* VALUES */}
      <section className="bg-gray-50 px-6 md:px-10 lg:px-[8%] py-20">

        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm tracking-[0.3em] text-gray-500">
            WHY VELORA
          </p>

          <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-gray-900">
            Designed around you.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">

          {/* DESIGN */}
          <div className="bg-white border border-gray-100 rounded-xl p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100">
              <Sparkles size={21} />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-gray-900">
              Timeless Design
            </h3>

            <p className="mt-3 text-sm leading-7 text-gray-500">
              Clean and versatile designs created to complement your
              everyday style.
            </p>
          </div>

          {/* QUALITY */}
          <div className="bg-white border border-gray-100 rounded-xl p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100">
              <ShieldCheck size={21} />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-gray-900">
              Quality First
            </h3>

            <p className="mt-3 text-sm leading-7 text-gray-500">
              We focus on reliable products and details that make every
              watch worth wearing.
            </p>
          </div>

          {/* EVERY MOMENT */}
          <div className="bg-white border border-gray-100 rounded-xl p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100">
              <Clock size={21} />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-gray-900">
              Every Moment
            </h3>

            <p className="mt-3 text-sm leading-7 text-gray-500">
              From daily routines to special occasions, find a watch
              that fits your moment.
            </p>
          </div>

        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="px-6 md:px-10 lg:px-[8%] py-20 text-center">

        <p className="text-sm tracking-[0.3em] text-gray-500">
          FIND YOUR STYLE
        </p>

        <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-gray-900">
          Your time. Your style.
        </h2>

        <p className="mt-4 text-gray-500">
          Explore the VELORA collection and find your perfect watch.
        </p>

        <Link
          to="/products"
          className="inline-block mt-7 rounded-md bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
        >
          Explore Collection
        </Link>

      </section>

    </div>
  );
};

export default About;



