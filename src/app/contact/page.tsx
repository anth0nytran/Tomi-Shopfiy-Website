import React from 'react'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import FAQ from '@/components/sections/FAQ'

export default function ContactPage() {
  return (
    <main className="bg-[#F9F8F6] flex flex-col">
      <AnnouncementBar />
      <Header />

      <div className="flex-1">
        <section className="w-full pt-44 pb-20 md:pt-56 md:pb-32 px-6 md:px-12">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
              
              {/* Left Side: Header & Info */}
              <div>
                <span className="block text-xs font-bold tracking-[0.2em] uppercase text-stone-400 mb-6">
                  Get in Touch
                </span>
                <h1 className="font-heading text-4xl md:text-6xl text-stone-900 mb-8 leading-none">
                  Contact Us
                </h1>
                <p className="text-stone-600 text-lg font-light leading-relaxed mb-12 max-w-md">
                  Please don’t hesitate to reach out if you have any questions at all! Whether you need help with an order or just want to say hello.
                </p>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-stone-900 mb-2">Email</h3>
                    <a href="mailto:hello@tomijewelry.com" className="text-stone-600 hover:text-stone-900 transition-colors">Support@tomijewelry.com</a>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-stone-900 mb-2">Showroom</h3>
                    <p className="text-stone-600">2810 Riverby Rd. STE 104<br/>Houston, Texas 77020</p>
                  </div>
                </div>
              </div>

              {/* Right Side: Form */}
              <div className="bg-white border border-stone-100 p-8 md:p-12 rounded-sm shadow-sm">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-xs font-bold uppercase tracking-[0.1em] text-stone-500">Name</label>
                      <input 
                        id="name"
                        type="text" 
                        className="w-full bg-white border border-stone-200 p-4 text-stone-900 focus:outline-none focus:border-stone-400 transition-colors text-sm"
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-xs font-bold uppercase tracking-[0.1em] text-stone-500">Email</label>
                      <input 
                        id="email"
                        type="email" 
                        className="w-full bg-white border border-stone-200 p-4 text-stone-900 focus:outline-none focus:border-stone-400 transition-colors text-sm"
                        placeholder="Your email"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-xs font-bold uppercase tracking-[0.1em] text-stone-500">Phone (Optional)</label>
                    <input 
                      id="phone"
                      type="tel" 
                      className="w-full bg-white border border-stone-200 p-4 text-stone-900 focus:outline-none focus:border-stone-400 transition-colors text-sm"
                      placeholder="Your phone number"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-xs font-bold uppercase tracking-[0.1em] text-stone-500">Message</label>
                    <textarea 
                      id="message"
                      rows={5}
                      className="w-full bg-[#F9F8F6] border border-transparent p-4 text-stone-900 focus:outline-none focus:bg-white focus:border-stone-300 transition-all text-sm resize-none"
                      placeholder="How can we help?"
                    />
            </div>

                  <button 
                    type="submit" 
                    className="w-full bg-stone-900 text-white text-xs font-bold uppercase tracking-[0.2em] py-5 hover:bg-stone-700 transition-colors"
                  >
                    Send Message
                  </button>
          </form>
              </div>

            </div>
        </div>
      </section>

        {/* FAQ Section */}
        <div id="faq">
      <FAQ />
        </div>
      </div>

      <Footer />
    </main>
  )
}
