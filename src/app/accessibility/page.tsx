import React from 'react'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'

const policySections = [
  {
    title: 'Providing Goods & Services to People with Disabilities',
    paragraphs: [
      'Tomi Jewelry is committed to excellence in servicing all customers, including people with disabilities, and we carry out our functions and responsibilities in the following areas:',
    ],
  },
  {
    title: 'Communication',
    paragraphs: [
      'We communicate with people with disabilities in ways that take into account their disabilities.',
      'We train all employees who communicate with customers on how to interact and communicate with people with various types of disabilities.',
      'This includes training on how to communicate with customers over the telephone using clear and plain language and adjusting pace of speech, as needed.',
      'We offer to communicate with customers by email, through our website and other methods if telephone communication is not suitable to their needs.',
    ],
  },
  {
    title: 'Assisted Devices',
    paragraphs: [
      'We are committed to serving people with disabilities who use assistive devices to obtain, use or benefit from our goods and services.',
      'We will ensure that our employees are trained to be receptive to various assistive devices that may be used by customers with disabilities while accessing our goods or services.',
    ],
  },
  {
    title: 'In-Store Accessibility & Facilities',
    paragraphs: [
      'A majority of the furniture in the store (except the floating table), including the Jade Bar, is ADA-compliant. If you need any assistance with seating or access to displays, our team will be happy to help.',
    ],
  },
  {
    title: 'Use of Service Animals or Support Persons',
    paragraphs: [
      'We are committed to welcoming people with disabilities who are accompanied by a service animal on the parts of our premises that are open to the public and other third parties, except where the animal is excluded by law. At no time will a person with disability who is accompanied by a service animal be denied access to their service animal while on the premises. We will ensure that all employees are properly trained on how to interact with people with disabilities who are accompanied by a service animal.',
      'We are committed to welcoming people with disabilities who are accompanied by a support person. Any person with a disability who is accompanied by a support person will be allowed to enter our premises with their support person. At no time will a person with a disability who is accompanied by a support person be prevented from having access to their support person while on our premises.',
      'Special accommodations (with notice): If you require any additional accommodations (e.g., private consultation space, extended appointment time, alternative communication formats), please contact us in advance so we can make appropriate arrangements. Call (281) 994-5813 or email support@tomijewelry.com and let us know what you need.',
    ],
  },
  {
    title: 'Notice of Temporary Disruption',
    paragraphs: [
      'In the event of a planned or unexpected disruption in our facilities or services usually used by people with disabilities, Tomi Jewelry will ensure the postage of a notice of temporary disruption. This notice will include information about the reason for the disruption, its anticipated duration, and a description of alternative facilities or services, if available.',
      'Tomi Jewelry will offer to communicate with individuals in person if a notice is not suitable to their communication needs.',
    ],
  },
  {
    title: 'Training of Employees',
    paragraphs: [
      'Tomi Jewelry will provide training to all Associates who work with the public and all parties who are involved in the development and approvals of customer service policies, practices and procedures. Individuals in the following positions, but not limited to are trained:',
      'Office Associates; Service Centre Office Associates; District Sales Managers; Store Salaried Associates; Store Hourly Associates.',
    ],
    listTitle: 'Training will include the following:',
    listItems: [
      'How to interact and communicate with people with various types of disabilities;',
      'How to interact with people who use an assistive device or require the assistance of a service animal or a support person;',
      'How to use equipment on business premises or otherwise that may help with the provision of services to people with disabilities;',
      'What to do if a person with disability is having difficulty in accessing services provided by Tomi Jewelry;',
      'Tomi Jewelry’s policies, practices and procedures pertaining to providing accessible customer service to customers with disabilities.',
    ],
  },
  {
    title: 'Feedback Process',
    paragraphs: [
      'The goal of this policy is to deliver customer service in a way that meets customer expectations while servicing customers with disabilities. Comments on our services regarding how well these expectations are being met are welcome and appreciated.',
      'Feedback regarding the way Tomi Jewelry provides goods and services to people with disabilities can be made by contacting our Customer Service team at (281) 994-5813 or by emailing support@tomijewelry.com. Complaints will be addressed according to complaint procedures.',
    ],
  },
  {
    title: 'Information and Communications',
    paragraphs: [
      'Tomi Jewelry is committed to meeting the communication needs of people with disabilities. When asked, Tomi Jewelry will provide information and communication materials in accessible formats or with communication supports.',
      'This includes publicly available information about our services and facilities, as well as publicly available emergency information. Tomi Jewelry will consult with people with disabilities to determine their information and communication needs.',
    ],
  },
  {
    title: 'Modification to Policies',
    paragraphs: [
      'We are committed to developing customer service policies that respect and promote the dignity and independence of people with disabilities. Therefore, no changes will be made to this policy before considering the impact on people with disabilities.',
      'Any policy of Tomi Jewelry that does not respect and promote the dignity and independence of people with disabilities will either be modified or removed.',
    ],
  },
]

const websiteAccessibility = {
  title: 'Website Accessibility',
  paragraphs: [
    'We design and test our website with accessibility in mind and are working to meet or exceed the principles of the W3C Web Content Accessibility Guidelines (WCAG) and applicable requirements under the ADA (Title III). Our goal is to support reader/reading modes, keyboard navigation, and easy zoom so that text and layout remain usable at up to 200% magnification without loss of content or functionality.',
    'What we’re focusing on:',
  ],
  focusAreas: [
    'Text alternatives for non-text content (alt text)',
    'Sufficient color contrast and non-color cues for important information',
    'Keyboard-only navigation and visible focus states',
    'Logical heading structure and labels for forms',
    'Compatibility with common browser Reader/Reading Modes and screen readers',
    'Resizable text and responsive layouts that reflow without horizontal scrolling',
  ],
  referencesTitle: 'Standards & references:',
  references: [
    { label: 'WCAG overview (W3C)', href: 'https://www.w3.org/WAI/standards-guidelines/wcag/' },
    { label: 'ADA guidance on web accessibility (ADA.gov)', href: 'https://www.ada.gov/resources/web-guidance/' },
    { label: 'WAI-ARIA Authoring Practices', href: 'https://www.w3.org/WAI/ARIA/apg/' },
  ],
  thirdParty: 'If we implement reputable third-party accessibility tools, plug-ins, or overlays to enhance access, we will list them here and provide links to their documentation and conformance statements.',
  closing: 'Need help or see an issue? If you experience any difficulty using our site or have suggestions to improve accessibility, please contact us at support@tomijewelry.com or (281) 994-5813. Please include the web page URL and a brief description of the problem, and we’ll do our best to assist promptly.',
}

export default function AccessibilityPage() {
  return (
    <main className="min-h-screen bg-[#F9F8F6] flex flex-col">
      <AnnouncementBar />
      <Header />

      <div className="flex-1">
        <section className="pt-40 pb-20 md:pt-52 md:pb-32 px-6 md:px-12">
          <div className="container mx-auto max-w-4xl">

            <div className="text-center mb-16">
              <span className="block text-xs font-bold tracking-[0.2em] uppercase text-stone-400 mb-6">
                Statement
              </span>
              <h1 className="font-heading text-4xl md:text-6xl text-stone-900 mb-6 leading-tight">
                Accessibility
              </h1>
              <div className="flex justify-center mb-10">
                 <span className="inline-block px-4 py-1.5 bg-[#efdada] text-stone-900 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
                   Updated 2025
                 </span>
              </div>
              <p className="text-stone-600 text-lg font-light leading-relaxed max-w-2xl mx-auto">
                We are committed to diversity, inclusion, and meeting the needs of all customers. We are continually improving our site to comply with WCAG 2.0 AA guidelines.
              </p>
            </div>

            <div className="bg-white border border-stone-100 shadow-sm p-8 md:p-16 rounded-sm">
              
              {/* Intro */}
              <div className="mb-16 border-b border-stone-100 pb-12">
                <p className="text-stone-600 font-light leading-relaxed mb-6 text-lg">
                  If the format of any material on our web pages interferes with your ability to access information, please contact us to request assistance.
                </p>
                <div className="flex flex-col md:flex-row gap-6 md:gap-12 pt-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Call Us</h4>
                    <a href="tel:2819945813" className="text-stone-900 hover:text-stone-600 font-medium border-b border-stone-200 pb-0.5">(281) 994-5813</a>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Email Us</h4>
                    <a href="mailto:support@tomijewelry.com" className="text-stone-900 hover:text-stone-600 font-medium border-b border-stone-200 pb-0.5">support@tomijewelry.com</a>
                  </div>
                </div>
              </div>

              {/* Policy Sections */}
              <div className="space-y-16">
                {policySections.map((section, idx) => (
                  <div key={idx}>
                    <h3 className="font-heading text-2xl text-stone-900 mb-6">
                      {section.title}
                    </h3>
                    <div className="space-y-4 text-stone-600 font-light leading-relaxed text-sm md:text-base">
                      {section.paragraphs?.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                    
                    {section.listTitle && (
                      <div className="mt-6">
                        <p className="font-medium text-stone-900 mb-4 text-sm">{section.listTitle}</p>
                        <ul className="space-y-3">
                          {section.listItems?.map((item, i) => (
                            <li key={i} className="flex gap-3 items-start text-stone-600 font-light text-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#efdada] mt-2 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Website Accessibility Section */}
              <div className="mt-16 pt-16 border-t border-stone-100">
                <h3 className="font-heading text-2xl text-stone-900 mb-6">
                  {websiteAccessibility.title}
                </h3>
                
                <div className="space-y-4 text-stone-600 font-light leading-relaxed text-sm md:text-base mb-8">
                  {websiteAccessibility.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>

                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                  {websiteAccessibility.focusAreas.map((item, i) => (
                    <li key={i} className="flex gap-3 items-start bg-[#F9F8F6] p-4 rounded-sm text-sm text-stone-600">
                      <span className="text-primary font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="bg-[#F9F8F6] p-6 md:p-8 rounded-sm">
                  <p className="font-bold uppercase tracking-widest text-xs text-stone-900 mb-4">
                    {websiteAccessibility.referencesTitle}
                  </p>
                  <div className="flex flex-wrap gap-4 mb-6">
                    {websiteAccessibility.references.map((ref, i) => (
                      <a 
                        key={i} 
                        href={ref.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold uppercase tracking-widest text-stone-500 border border-stone-200 px-4 py-2 hover:border-primary hover:text-primary transition-colors bg-white"
                      >
                        {ref.label}
                      </a>
                    ))}
                  </div>
                  <p className="text-stone-500 text-xs leading-relaxed italic">
                    {websiteAccessibility.thirdParty}
                  </p>
                </div>
                
                <div className="mt-8 text-stone-600 font-light text-sm leading-relaxed">
                   <p>{websiteAccessibility.closing}</p>
                </div>

              </div>

            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
