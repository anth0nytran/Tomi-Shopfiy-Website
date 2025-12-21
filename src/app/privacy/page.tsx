import React from 'react'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function PrivacyPage() {
  return (
    <main className="bg-[#F9F8F6] flex flex-col min-h-screen">
      <AnnouncementBar />
      <Header />

      <div className="flex-1">
        <section className="pt-40 pb-20 md:pt-52 md:pb-32 px-6 md:px-12">
          <div className="container mx-auto max-w-4xl">
            
            <div className="text-center mb-16">
              <span className="block text-xs font-bold tracking-[0.2em] uppercase text-stone-400 mb-6">
                Legal
              </span>
              <h1 className="font-heading text-4xl md:text-6xl text-stone-900 mb-6 leading-tight">
                Privacy Policy
              </h1>
              <p className="text-stone-600 text-lg font-light leading-relaxed max-w-2xl mx-auto">
                Effective Date: December 19, 2025
              </p>
            </div>

            <div className="bg-white border border-stone-100 shadow-sm p-8 md:p-12 max-w-3xl mx-auto space-y-12">
              
              <div className="space-y-6 text-stone-600 font-light leading-relaxed">
                 <p>This Privacy Policy describes how Tomi Jewelry (“Tomi,” “we,” “us,” or “our”) collects, uses, discloses, and protects personal information when you visit tomijewelry.com (the “Site”), create an account, make a purchase, or otherwise interact with us.</p>
                 
                 <div className="bg-stone-50 p-6 rounded-sm">
                    <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-stone-900 mb-4">Contact Information</h3>
                    <ul className="space-y-2 text-sm">
                        <li><span className="font-bold text-stone-800">Privacy Requests:</span> <a href="mailto:support@tomijewelry.com" className="border-b border-stone-300 hover:border-stone-900 transition-colors">support@tomijewelry.com</a></li>
                        <li><span className="font-bold text-stone-800">Customer Support:</span> <a href="mailto:support@tomijewelry.com" className="border-b border-stone-300 hover:border-stone-900 transition-colors">support@tomijewelry.com</a> | (281) 944-5813</li>
                        <li><span className="font-bold text-stone-800">Notice Address:</span> 2810 Riverby Road, Suite 104, Houston, TX 77020</li>
                    </ul>
                 </div>
              </div>

              <div>
                  <h3 className="font-heading text-2xl text-stone-900 mb-4">1. Scope</h3>
                  <p className="text-stone-600 font-light leading-relaxed">This Policy applies to personal information we collect through the Site and related services. It does not apply to third-party websites or services that may be linked from the Site.</p>
              </div>

              <div>
                  <h3 className="font-heading text-2xl text-stone-900 mb-4">2. Information We Collect</h3>
                  
                  <div className="space-y-6">
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-stone-800 mb-2">A) Information You Provide</h4>
                        <ul className="list-disc pl-5 space-y-1 text-stone-600 font-light">
                            <li><strong>Identifiers and contact details:</strong> name, email address, phone number, shipping/billing address</li>
                            <li><strong>Account information:</strong> account details and preferences you create or maintain</li>
                            <li><strong>Order and transaction details:</strong> items purchased, order history, shipping details, refunds/returns</li>
                            <li><strong>Communications:</strong> messages you send us (e.g., support emails)</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-stone-800 mb-2">B) Information Collected Automatically</h4>
                        <ul className="list-disc pl-5 space-y-1 text-stone-600 font-light">
                            <li><strong>Device and usage data:</strong> IP address, device type, browser type, pages viewed, and interaction data</li>
                            <li><strong>Analytics and performance data:</strong> collected via Vercel Analytics and Google Analytics</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-stone-800 mb-2">C) Information from Service Providers</h4>
                        <p className="text-stone-600 font-light leading-relaxed">We may receive information from service providers that support our operations, such as our commerce platform, payment processing, marketing, and analytics providers.</p>
                    </div>
                  </div>
              </div>

              <div>
                  <h3 className="font-heading text-2xl text-stone-900 mb-4">3. How We Use Information</h3>
                  <p className="text-stone-600 font-light leading-relaxed mb-4">We use personal information to:</p>
                  <ul className="list-disc pl-5 space-y-1 text-stone-600 font-light leading-relaxed">
                      <li>process transactions, fulfill orders, and deliver products</li>
                      <li>create and manage user accounts</li>
                      <li>provide customer service and respond to inquiries</li>
                      <li>send transactional communications (order confirmations, shipping updates, service notices)</li>
                      <li>send marketing communications if you opt in (email and/or SMS), and to honor opt-outs</li>
                      <li>detect, prevent, and investigate fraud, misuse, or security incidents</li>
                      <li>comply with legal obligations and enforce our Terms</li>
                  </ul>
              </div>

              <div>
                  <h3 className="font-heading text-2xl text-stone-900 mb-4">4. How We Share Information</h3>
                  <p className="text-stone-600 font-light leading-relaxed mb-4">We may share personal information with the following categories of third parties:</p>
                  <ul className="list-disc pl-5 space-y-1 text-stone-600 font-light leading-relaxed mb-4">
                      <li><strong>Commerce platform and related providers</strong> (e.g., Shopify) for order processing, account management, and fulfillment operations</li>
                      <li><strong>Payment processing</strong> (e.g., Shopify Payments) to process payments and prevent fraud</li>
                      <li><strong>Email/SMS marketing providers</strong> (e.g., Klaviyo) to send marketing messages if you opt in</li>
                      <li><strong>Analytics providers</strong> (e.g., Google Analytics and Vercel Analytics) to understand Site usage and performance</li>
                      <li><strong>Legal, compliance, and safety:</strong> authorities, regulators, or advisors when required by law or to protect rights, safety, and security</li>
                  </ul>
                  <p className="text-stone-600 font-light leading-relaxed">We do not authorize service providers to use personal information for purposes outside the services they provide to us, subject to their contractual obligations and applicable law.</p>
              </div>

              <div>
                  <h3 className="font-heading text-2xl text-stone-900 mb-4">5. Marketing (Email/SMS)</h3>
                  <div className="space-y-4 text-stone-600 font-light leading-relaxed">
                      <p><strong>Opt-In.</strong> Customers may opt in to marketing at checkout or through website signup forms.</p>
                      <p><strong>Unsubscribe / Opt-Out.</strong> You can unsubscribe at any time using the unsubscribe link in our marketing emails. If you opt in to SMS, you may opt out using the method provided in the messages (e.g., STOP) where applicable. Opt-out handling is managed through our commerce and marketing systems.</p>
                  </div>
              </div>

              <div>
                  <h3 className="font-heading text-2xl text-stone-900 mb-4">6. Cookies and Analytics</h3>
                  <div className="space-y-4 text-stone-600 font-light leading-relaxed">
                      <p>We and our service providers may use cookies and similar technologies to operate the Site and understand Site usage and performance.</p>
                      <p>You can control cookies through your browser settings. Disabling cookies may affect Site functionality (such as cart or account features).</p>
                      <div className="bg-stone-50 p-4 text-sm">
                          <p><strong>Note:</strong> We do not currently provide a dedicated cookie consent banner. If you are located in a jurisdiction that requires consent for non-essential cookies, you may limit cookies through your browser settings, and we may update our practices and disclosures as required.</p>
                      </div>
                  </div>
              </div>

              <div>
                  <h3 className="font-heading text-2xl text-stone-900 mb-4">7. International Customers; Cross-Border Transfers</h3>
                  <p className="text-stone-600 font-light leading-relaxed">We serve customers in the United States and internationally (including California, EU/UK, and Canada). Your information may be processed in the United States and other locations where our service providers operate. By using the Site, you understand your information may be transferred and processed outside your country of residence.</p>
              </div>

              <div>
                  <h3 className="font-heading text-2xl text-stone-900 mb-4">8. Legal Bases (Where Applicable)</h3>
                  <p className="text-stone-600 font-light leading-relaxed mb-4">Where required under applicable law (including in the EU/UK), we process personal information on the following bases:</p>
                  <ul className="list-disc pl-5 space-y-1 text-stone-600 font-light leading-relaxed">
                      <li><strong>Contract:</strong> to process orders and provide products/services you request</li>
                      <li><strong>Legitimate interests:</strong> to operate, secure, and improve the Site, prevent fraud, and support customers</li>
                      <li><strong>Consent:</strong> for certain marketing communications and, where required, certain cookies/technologies</li>
                      <li><strong>Legal obligation:</strong> to comply with laws, tax requirements, and regulatory requests</li>
                  </ul>
              </div>

              <div>
                  <h3 className="font-heading text-2xl text-stone-900 mb-4">9. Data Retention</h3>
                  <p className="text-stone-600 font-light leading-relaxed mb-2">We retain personal information as long as reasonably necessary to:</p>
                  <ul className="list-disc pl-5 space-y-1 text-stone-600 font-light leading-relaxed">
                      <li>fulfill orders and provide services</li>
                      <li>maintain business, accounting, and tax records</li>
                      <li>resolve disputes and enforce agreements</li>
                      <li>comply with legal obligations</li>
                  </ul>
              </div>

              <div>
                  <h3 className="font-heading text-2xl text-stone-900 mb-4">10. Security</h3>
                  <p className="text-stone-600 font-light leading-relaxed">We use reasonable administrative, technical, and physical safeguards designed to protect personal information. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.</p>
              </div>

              <div>
                  <h3 className="font-heading text-2xl text-stone-900 mb-4">11. Children’s Privacy</h3>
                  <p className="text-stone-600 font-light leading-relaxed">The Site is not intended for children under 13, and we do not knowingly collect personal information from children under 13. If you believe a child has provided personal information to us, contact <a href="mailto:support@tomijewelry.com" className="border-b border-stone-300 hover:border-stone-900 transition-colors">support@tomijewelry.com</a>.</p>
              </div>

              <div>
                  <h3 className="font-heading text-2xl text-stone-900 mb-4">12. Your Privacy Rights (Texas, California, and Other Regions)</h3>
                  <p className="text-stone-600 font-light leading-relaxed mb-4">Depending on where you live, you may have rights regarding your personal information, such as:</p>
                  <ul className="list-disc pl-5 space-y-1 text-stone-600 font-light leading-relaxed mb-6">
                      <li><strong>Access:</strong> request to know whether we process your personal information and obtain a copy</li>
                      <li><strong>Correction:</strong> request correction of inaccurate personal information</li>
                      <li><strong>Deletion:</strong> request deletion of personal information, subject to legal exceptions</li>
                      <li><strong>Portability:</strong> receive certain information in a usable format (where applicable)</li>
                      <li><strong>Opt-Out:</strong> opt out of certain processing, such as targeted advertising, sale of personal data, or certain profiling (where applicable)</li>
                  </ul>

                  <div className="space-y-6">
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-stone-800 mb-2">Texas Residents (TDPSA)</h4>
                        <p className="text-stone-600 font-light leading-relaxed">Texas residents may have rights to access, correct, delete, and obtain a copy of personal data, and to opt out of targeted advertising, sale of personal data, or certain profiling, as provided by Texas law.</p>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-stone-800 mb-2">California Residents (CCPA/CPRA)</h4>
                        <p className="text-stone-600 font-light leading-relaxed mb-2">California residents may have rights to know, delete, correct, and opt out of sale or sharing of personal information for cross-context behavioral advertising, and other rights under California law.</p>
                        <p className="text-stone-600 font-light leading-relaxed">We do not sell personal information for money. We do not share personal information for cross-context behavioral advertising as a business practice based on our current Site setup (no ad pixels and no targeted advertising tools are configured). If our practices change, we will update this Policy and provide any required opt-out mechanisms.</p>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-stone-800 mb-2">EU/UK and Other International Rights</h4>
                        <p className="text-stone-600 font-light leading-relaxed">Depending on your location, you may have additional rights (such as restriction, objection, and portability). You may also have the right to lodge a complaint with your local supervisory authority.</p>
                    </div>
                  </div>
              </div>

              <div>
                  <h3 className="font-heading text-2xl text-stone-900 mb-4">13. How to Submit a Privacy Request</h3>
                  <p className="text-stone-600 font-light leading-relaxed mb-4">Email <a href="mailto:support@tomijewelry.com" className="border-b border-stone-300 hover:border-stone-900 transition-colors">support@tomijewelry.com</a> with the subject line “Privacy Request” and include:</p>
                  <ul className="list-disc pl-5 space-y-1 text-stone-600 font-light leading-relaxed mb-4">
                      <li>your full name</li>
                      <li>the email used for your account/order</li>
                      <li>the specific request you are making</li>
                  </ul>
                  <p className="text-stone-600 font-light leading-relaxed mb-4">We may need to verify your identity before processing your request.</p>
                  
                  <div className="bg-stone-50 p-4 text-sm">
                      <p className="font-bold text-stone-800 mb-2">Texas Timing and Appeals</p>
                      <p className="text-stone-600 font-light leading-relaxed">Where applicable, we will respond to authenticated requests within the time required by Texas law (generally within 45 days, with possible extension where permitted). If we decline to take action on your request, we will provide a justification and instructions on how to appeal. To appeal, reply to our decision email or email support@tomijewelry.com with the subject line “Privacy Appeal.” We will respond to appeals within 60 days where required. If an appeal is denied, we will provide information on how to submit a complaint to the Texas Attorney General.</p>
                  </div>
              </div>

              <div>
                  <h3 className="font-heading text-2xl text-stone-900 mb-4">14. Changes to This Privacy Policy</h3>
                  <p className="text-stone-600 font-light leading-relaxed">We may update this Policy from time to time. The “Last Updated” date indicates when changes were made. Continued use of the Site after changes means you accept the updated Policy.</p>
              </div>

              <div>
                  <h3 className="font-heading text-2xl text-stone-900 mb-4">15. Contact</h3>
                  <p className="text-stone-600 font-light leading-relaxed">Questions about this Policy should be sent to <a href="mailto:support@tomijewelry.com" className="border-b border-stone-300 hover:border-stone-900 transition-colors">support@tomijewelry.com</a>.</p>
              </div>

            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}


