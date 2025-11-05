import React from 'react'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

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
    <main className="service-main accessibility-main">
      <AnnouncementBar />
      <Header />

      <section className="service-hero accessibility-hero" aria-label="Accessibility statement" data-anim="fade-in" data-delay="0">
        <article className="service-card accessibility-card" data-anim="fade-in" data-delay="160">
          <header className="accessibility-head">
            <p className="service-eyebrow">Accessibility</p>
            <div className="accessibility-meta" aria-label="Last updated">
              <span className="accessibility-meta-label">Updated</span>
              <time dateTime="2025-11" className="accessibility-meta-date">November 2025</time>
            </div>
          </header>

          <h1 className="accessibility-title">We are committed to diversity, inclusion, and meeting the needs of all customers.</h1>

          <div className="accessibility-intro">
            <p>
              We are continually improving our site to comply with the accessibility guidelines in WCAG 2.0 AA.
              Further efforts are currently in the works and we continue to update our website to improve accessibility.
            </p>
            <p>
              In the meantime, if the format of any material on our web pages interferes with your ability to access the information,
              please contact us to request assistance or if you have questions or comments about our sites’ accessibility.
              Please call <strong>(281) 994-5813</strong> or email <strong>support@tomijewelry.com</strong>.
            </p>
          </div>

          <div className="accessibility-sections">
            {policySections.map(section => (
              <section key={section.title} className="accessibility-section">
                <h2 className="accessibility-section-title">{section.title}</h2>
                {section.paragraphs?.map(paragraph => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.listTitle ? <p className="accessibility-list-title">{section.listTitle}</p> : null}
                {section.listItems ? (
                  <ul className="accessibility-list">
                    {section.listItems.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}

            <section className="accessibility-section">
              <h2 className="accessibility-section-title">{websiteAccessibility.title}</h2>
              {websiteAccessibility.paragraphs.slice(0, 1).map(paragraph => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p className="accessibility-list-title">{websiteAccessibility.paragraphs[1]}</p>
              <ul className="accessibility-list">
                {websiteAccessibility.focusAreas.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="accessibility-list-title">{websiteAccessibility.referencesTitle}</p>
              <ul className="accessibility-resources">
                {websiteAccessibility.references.map(reference => (
                  <li key={reference.href}>
                    <a href={reference.href} target="_blank" rel="noopener noreferrer">
                      {reference.label}
                    </a>
                  </li>
                ))}
              </ul>
              <p>{websiteAccessibility.thirdParty}</p>
              <p>{websiteAccessibility.closing}</p>
            </section>
          </div>
        </article>
      </section>

      <Footer />
    </main>
  )
}

