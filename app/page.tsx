'use client';
import Header from "@/app/(log-in)/HomeHeader";
import Icon from "@/components/Icon";
import Logo from "@/components/Logo";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  if (localStorage.getItem("token"))
    router.push("/admin-dashboard");
    
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Business />
        <Feedback />
        <Footer />
      </main>
    </>
  )
}

function Hero() {
  return (
    <section className="container h-screen pt-14 flex gap-10 items-center">
      <div className="w-2/3 h-full flex flex-col justify-center gap-8 text-center">
        <h2 className="font-bold text-6xl capitalize ">
          A straight way to manage your inventory
        </h2>
        <p className="font-semibold bg-lime-200">
          "Streamline Your Business with Our Inventory Management App: Effortless Control, Real-time Insights, and Seamless Efficiency!"
        </p>
        <div className="h-14 flex justify-center items-center ">
          <Link
            className="flex gap-4 items-center h-fit py-2 px-4 rounded-xl bg-slate-800 text-white font-bold shadow-md"
            href="/admin-login"
          >
            Let's start
            <Icon name="arrow-right" />
          </Link>
        </div>
        <div className="flex justify-between items-center h-28 p-2 rounded-xl border-2 font-semibold text-2xl">
          <div className="w-full flex gap-3 items-center justify-center">
            <Icon name="truck-fast" size="xl" />
            Fast
          </div>
          <div className="w-full flex gap-3 items-center justify-center">
            <Icon name="face-smile-wink" size="xl" />
            Convenience
          </div>
          <div className="w-full flex gap-3 items-center justify-center">
            <Icon name="key" size="xl" />
            Trustable
          </div>
        </div>
      </div>
      <div className="relative w-1/3 h-5/6">
        <Image
          className="object-cover"
          src="/images/hero.jpg"
          alt="Hero image"
          fill
        />
      </div>
    </section>
  )
}

function Business() {
  return (
    <section className="pt-16 pb-20 text-center bg-gray-100">
      <div className="container flex flex-col gap-10">
        <h3 className="text-2xl font-semibold">
          Our services are designed for businesses of all sizes
        </h3>
        <div className="grid grid-cols-3 gap-10">
          <BCard src="/images/business-1.jpg" text="For small business"/>
          <BCard src="/images/business-2.jpg" text="For startups"/>
          <BCard src="/images/business-3.jpg" text="Business enterprises"/>
        </div>
      </div>
    </section>
  )
}

function BCard({
  src,
  text
}: {
  src: string,
  text: string,
}) {
  return (
    <div className="relative w-full aspect-square rounded-2xl border-2 overflow-hidden group">
      <Image 
        className="object-cover"
        src={src}
        alt="Card image"
        fill
      />
      <div className="absolute bottom-0 inset-x-0 h-16 p-2 text-center backdrop-blur-md bg-black bg-opacity-20 flex items-center">
        <p className="w-full text-white uppercase text-xl font-semibold">
          {text}
        </p>
      </div>
    </div>
  )
}

function Feedback({

}: {

}) {
  return (
    <section className="bg-sky-100 pt-16 pb-20">
      <div className="container flex flex-col gap-10">
        <h3 className="text-center text-2xl font-semibold">You're in good company</h3>
        <div className=" flex gap-20">
          <FCard feedback="One bank is a truly great bank" name="Jem Smith" job="Head of sales at Tesla"/>
          <FCard feedback="You have found the best inventory app" name="Adam White" job="Accountant at ozone"/>
          <FCard feedback="The best customer service" name="Cris Lee" job="CFO at Montee"/>
        </div>  
      </div>
    </section>
  )
}

function FCard({
  feedback,
  name,
  job,
}: {
  feedback: string,
  name: string,
  job: string,
}) {
  return (
    <div className="w-full aspect-square flex flex-col p-5 gap-5 rounded-xl bg-white">
      <h3 className="capitalize font-semibold text-2xl">
        "{feedback}"
      </h3>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Non quisquam doloribus eum sunt minus iure molestiae animi nobis. Fugiat, itaque.</p>
      <div className="mt-auto flex gap-4 items-center">
        <div className="flex-shrink-0 rounded-full w-16 aspect-square bg-gray-400"></div>
        <div className="w-full flex flex-col font-semibold">
          <p className="text-lg">{name}</p>
          <p className="text-gray-400">{job}</p>
        </div>
      </div>
    </div>
  )
}

function Footer({

}: {

}) {
  return (
    <section className="py-10 bg-slate-800">
      <div className="container flex text-white">
        <section className="w-1/3 flex flex-col gap-6">
          <Logo />
          <div className="flex gap-4">
            <Social name="facebook-f fa-brands" />
            <Social name="twitter fa-brands" />
            <Social name="instagram fa-brands" />
          </div>
          All Copyright Reserved ©
        </section>

        <section className="w-2/3 flex text-white font-semibold">
          <ul className="w-full flex flex-col gap-2">
              <li className="text-lime-300">Product</li>
              <li className="">Overview</li>
              <li className="">Features</li>
              <li className="">Solutions</li>
              <li className="">Tutorials</li>
          </ul>
          <ul className="w-full flex flex-col gap-2">
            <li className="text-lime-300">Company</li>
            <li className="">About us</li>
            <li className="">Careers</li>
            <li className="">Press</li>
            <li className="">News</li>
          </ul>
          <ul className="w-full flex flex-col gap-2">
            <li className="text-lime-300">Resources</li>
            <li className="">Blogs</li>
            <li className="">Newsletter</li>
            <li className="">Events</li>
            <li className="">Help centre</li>
          </ul>
        </section>
      </div>
    </section>
  )
}

function Social({
  name
}: { 
  name: string
}) {
  return (
    <div className="w-12 aspect-square grid place-items-center border-2 rounded-2xl text-white hover:bg-lime-300 hover:text-slate-800 cursor-pointer">
      <Icon name={name} size="xl" />
    </div>
  )
}