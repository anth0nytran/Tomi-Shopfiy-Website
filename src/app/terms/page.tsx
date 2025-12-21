import React from 'react'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function TermsPage() {
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
                Terms of Service
              </h1>
              <p className="text-stone-600 text-lg font-light leading-relaxed max-w-2xl mx-auto">
                Effective Date: December 19, 2025
              </p>
            </div>

            <div className="bg-white border border-stone-100 shadow-sm p-8 md:p-12 max-w-3xl mx-auto space-y-12">
              
              <div className="space-y-6 text-stone-600 font-light leading-relaxed">
                 <p>Welcome to tomijewelry.com (the “Site”). The Site is operated by Tomi Jewelry (also referred to as “Tomi,” “we,” “us,” or “our”).</p>
                 
                 <div className="bg-stone-50 p-6 rounded-sm">
                    <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-stone-900 mb-4">Contact Information</h3>
                    <ul className="space-y-2 text-sm">
                        <li><span className="font-bold text-stone-800">Customer Support:</span> <a href="mailto:support@tomijewelry.com" className="border-b border-stone-300 hover:border-stone-900 transition-colors">support@tomijewelry.com</a> | (281) 944-5813</li>
                        <li><span className="font-bold text-stone-800">Notice Address:</span> 2810 Riverby Road, Suite 104, Houston, TX 77020</li>
                    </ul>
                 </div>

                 <p className="font-medium text-stone-900 uppercase tracking-widest text-xs leading-relaxed border-l-2 border-stone-900 pl-4 py-2">
                   PLEASE READ THESE TERMS OF SERVICE (“TERMS”) CAREFULLY. BY ACCESSING OR USING THE SITE, CREATING AN ACCOUNT, OR PLACING AN ORDER, YOU AGREE TO BE BOUND BY THESE TERMS. IF YOU DO NOT AGREE, DO NOT USE THE SITE.
                 </p>
              </div>

              <div>
                  <h3 className="font-heading text-2xl text-stone-900 mb-4">1. Eligibility</h3>
                  <p className="text-stone-600 font-light leading-relaxed">You must be at least 18 years old (or the age of majority in your jurisdiction) to make a purchase from the Site.</p>
              </div>

              <div>
                  <h3 className="font-heading text-2xl text-stone-900 mb-4">2. Accounts</h3>
                  <p className="text-stone-600 font-light leading-relaxed">You may be able to create an account on the Site. You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. You agree to provide accurate information and to keep your account information up to date. We may suspend or terminate accounts that we reasonably believe are being used for fraud, abuse, or unlawful activity.</p>
              </div>

              <div>
                  <h3 className="font-heading text-2xl text-stone-900 mb-4">3. Products; Materials; Natural Variation</h3>
                  <div className="space-y-4 text-stone-600 font-light leading-relaxed">
                    <p>We sell 14k gold jewelry (including chains, hoops, rings, necklaces, earrings/flatbacks) and items that may include natural gemstones (including jade, moonstone, topaz, sapphire, peridot, tourmaline, labradorite, opal, garnet), natural pearls, diamonds (natural unless otherwise stated on the product page), and abalone shell accents.</p>
                    <p>Natural stones, pearls, and shell materials can vary in color, pattern, clarity, and appearance. Product photos are for illustrative purposes and may differ from the actual item due to natural variation and device display settings.</p>
                  </div>
              </div>

              <div>
                  <h3 className="font-heading text-2xl text-stone-900 mb-4">4. Pricing, Currency, Taxes</h3>
                  <ul className="space-y-2 text-stone-600 font-light leading-relaxed">
                      <li><strong>Currency.</strong> All prices are listed in USD.</li>
                      <li><strong>Taxes.</strong> Prices shown do NOT include sales tax. Taxes are calculated automatically at checkout based on the customer’s location. Shipping charges are subject to tax where applicable.</li>
                      <li><strong>Pricing Errors.</strong> We reserve the right to correct pricing, typographical, or other errors at any time. If an item is listed at an incorrect price or with incorrect information, we may cancel or refuse any order placed for that item, even if the order has been confirmed and/or charged.</li>
                  </ul>
              </div>

              <div>
                  <h3 className="font-heading text-2xl text-stone-900 mb-4">5. Orders; Acceptance; Cancellations</h3>
                  <ul className="space-y-2 text-stone-600 font-light leading-relaxed">
                      <li><strong>Placing an Order.</strong> Submitting an order is an offer to purchase. We may accept, reject, or cancel orders at our discretion, including due to inventory limitations, suspected fraud, payment authorization issues, or other circumstances.</li>
                      <li><strong>Order Acceptance.</strong> An order is not guaranteed to be accepted until we confirm fulfillment/shipment or otherwise confirm acceptance.</li>
                      <li><strong>Cancellations.</strong> If you need to request a cancellation, contact <a href="mailto:support@tomijewelry.com" className="border-b border-stone-300 hover:border-stone-900 transition-colors">support@tomijewelry.com</a> as soon as possible. We will attempt to accommodate cancellation requests; however, once an order has begun processing or has shipped, cancellation may not be possible. Custom items are final sale (see Section 9).</li>
                  </ul>
              </div>

              <div>
                  <h3 className="font-heading text-2xl text-stone-900 mb-4">6. Payment Processing</h3>
                  <p className="text-stone-600 font-light leading-relaxed">Payments are processed through Shopify Payments. You represent that you are authorized to use the payment method you provide. We do not store full payment card numbers. Payment information is handled by our payment processor(s) subject to their terms and policies.</p>
              </div>

              <div>
                  <h3 className="font-heading text-2xl text-stone-900 mb-4">7. Shipping & Delivery</h3>
                  <div className="space-y-6 text-stone-600 font-light leading-relaxed">
                      <p>We ship to the United States and internationally.</p>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-stone-50 p-6 rounded-sm">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-stone-800 mb-3">Domestic (Flat Rate)</h4>
                            <ul className="space-y-2 text-sm">
                                <li className="flex justify-between"><span>Express (1–2 business days)</span> <span className="font-medium">$20</span></li>
                                <li className="flex justify-between"><span>Standard (1–5 business days)</span> <span className="font-medium">$8</span></li>
                            </ul>
                        </div>
                        <div className="bg-stone-50 p-6 rounded-sm">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-stone-800 mb-3">International (Flat Rate)</h4>
                            <ul className="space-y-2 text-sm">
                                <li className="flex justify-between"><span>Express Int (1–5 business days)</span> <span className="font-medium">$45</span></li>
                                <li className="flex justify-between"><span>Standard Int (6–12 business days)</span> <span className="font-medium">$25</span></li>
                            </ul>
                        </div>
                      </div>

                      <ul className="space-y-2">
                          <li><strong>Shipping Timeframes.</strong> The timeframes above are estimates and are not guarantees. Delivery times may vary due to carrier delays, customs processing, holidays, weather, and other factors outside our control.</li>
                          <li><strong>International Duties/Taxes.</strong> International shipments may be subject to import duties, taxes, and fees assessed by the destination country. These charges are the customer’s responsibility unless we explicitly state otherwise at checkout.</li>
                      </ul>
                  </div>
              </div>

              <div>
                  <h3 className="font-heading text-2xl text-stone-900 mb-4">8. Risk of Loss; Lost or Stolen Packages</h3>
                  <p className="text-stone-600 font-light leading-relaxed">Once the carrier confirms delivery to the address provided at checkout, the customer is responsible for the package. If a package is lost after carrier-confirmed delivery, customers should file a claim with the carrier. We will assist with reasonable documentation when available but cannot offer refunds or replacements for carrier-confirmed deliveries.</p>
              </div>

              <div>
                  <h3 className="font-heading text-2xl text-stone-900 mb-4">9. Returns, Exchanges, Store Credit, and Refunds</h3>
                  <div className="space-y-6 text-stone-600 font-light leading-relaxed">
                      <div>
                          <h4 className="text-sm font-bold uppercase tracking-widest text-stone-800 mb-2">Return Windows</h4>
                          <ul className="list-disc pl-5 space-y-1">
                              <li>Refund to original payment method: within 30 days (subject to approval and inspection)</li>
                              <li>Store credit exchange: within 45 days (subject to approval and inspection)</li>
                          </ul>
                      </div>
                      
                      <div>
                          <h4 className="text-sm font-bold uppercase tracking-widest text-stone-800 mb-2">Return Conditions</h4>
                          <p>Returned items must be in original condition without any signs of wear or damage and must include proof of purchase.</p>
                      </div>

                      <div>
                          <h4 className="text-sm font-bold uppercase tracking-widest text-stone-800 mb-2">Non-Returnable / Final Sale Items</h4>
                          <ul className="list-disc pl-5 space-y-1">
                              <li>For hygiene reasons, earrings used during a piercing appointment cannot be returned</li>
                              <li>Custom pieces are final sale</li>
                          </ul>
                      </div>

                      <div>
                          <h4 className="text-sm font-bold uppercase tracking-widest text-stone-800 mb-2">Return Shipping</h4>
                          <p>Customers pay a flat rate of $8.00 for return shipping (except for defective items or our shipping errors). If we are unable to provide a return label for your location, you are responsible for return shipping costs.</p>
                      </div>

                      <div>
                          <h4 className="text-sm font-bold uppercase tracking-widest text-stone-800 mb-2">Restocking Fee</h4>
                          <p>A 15% restocking fee applies to all approved returns.</p>
                      </div>

                      <div>
                          <h4 className="text-sm font-bold uppercase tracking-widest text-stone-800 mb-2">Refund Timing and Deductions</h4>
                          <p>Refunds are processed within 5–10 business days after we receive and inspect the returned item.</p>
                          <p>Approved refunds will be issued to the original payment method, minus the 15% restocking fee and applicable return shipping cost(s) (unless waived due to defect or our error).</p>
                      </div>

                      <div>
                          <h4 className="text-sm font-bold uppercase tracking-widest text-stone-800 mb-2">Return Process</h4>
                          <p>To initiate a return or exchange, contact <a href="mailto:support@tomijewelry.com" className="border-b border-stone-300 hover:border-stone-900 transition-colors">support@tomijewelry.com</a> with your order number and request details. We may require photos or additional information to evaluate eligibility.</p>
                      </div>
                  </div>
              </div>

              <div>
                  <h3 className="font-heading text-2xl text-stone-900 mb-4">10. Defective Items; Shipping Errors</h3>
                  <p className="text-stone-600 font-light leading-relaxed">If you receive an incorrect item or believe an item is defective, contact <a href="mailto:support@tomijewelry.com" className="border-b border-stone-300 hover:border-stone-900 transition-colors">support@tomijewelry.com</a> with your order number and photos. We will work with you on a resolution consistent with this policy and applicable law.</p>
              </div>

              <div>
                  <h3 className="font-heading text-2xl text-stone-900 mb-4">11. Promotions</h3>
                  <p className="text-stone-600 font-light leading-relaxed">Promotions, discounts, and promo codes may be offered from time to time and may be subject to additional terms (including expiration dates, limitations, or exclusions). We reserve the right to modify or discontinue promotions at any time.</p>
              </div>

              <div>
                  <h3 className="font-heading text-2xl text-stone-900 mb-4">12. Intellectual Property</h3>
                  <p className="text-stone-600 font-light leading-relaxed">All content on the Site—including text, graphics, photographs, product images, logos, designs, and software—is owned by or licensed to Tomi Jewelry and is protected by applicable intellectual property laws. You may not reproduce, distribute, modify, create derivative works of, publicly display, or exploit Site content without our prior written permission.</p>
              </div>

              <div>
                  <h3 className="font-heading text-2xl text-stone-900 mb-4">13. Prohibited Conduct</h3>
                  <p className="text-stone-600 font-light leading-relaxed mb-4">You agree not to:</p>
                  <ul className="list-disc pl-5 space-y-1 text-stone-600 font-light leading-relaxed">
                      <li>use the Site for unlawful purposes;</li>
                      <li>interfere with the Site’s security or operation;</li>
                      <li>scrape, crawl, or use automated means to access the Site without permission;</li>
                      <li>attempt to access non-public areas or systems;</li>
                      <li>submit false, misleading, or fraudulent information.</li>
                  </ul>
              </div>

              <div>
                  <h3 className="font-heading text-2xl text-stone-900 mb-4">14. Disclaimers</h3>
                  <p className="text-stone-600 font-light leading-relaxed uppercase text-sm">THE SITE AND PRODUCTS ARE PROVIDED “AS IS” AND “AS AVAILABLE,” TO THE FULLEST EXTENT PERMITTED BY LAW. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE, EXCEPT WHERE PROHIBITED BY LAW.</p>
              </div>

              <div>
                  <h3 className="font-heading text-2xl text-stone-900 mb-4">15. Limitation of Liability</h3>
                  <div className="space-y-4 text-stone-600 font-light leading-relaxed uppercase text-sm">
                      <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, TOMI JEWELRY WILL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUE.</p>
                      <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, TOMI JEWELRY’S TOTAL LIABILITY FOR ANY CLAIM RELATED TO A PRODUCT OR THE SITE WILL NOT EXCEED THE AMOUNT YOU PAID TO US FOR THE ORDER GIVING RISE TO THE CLAIM.</p>
                      <p>SOME JURISDICTIONS DO NOT ALLOW CERTAIN LIMITATIONS, SO SOME OR ALL OF THE ABOVE MAY NOT APPLY TO YOU.</p>
                  </div>
              </div>

              <div>
                  <h3 className="font-heading text-2xl text-stone-900 mb-4">16. Indemnification</h3>
                  <p className="text-stone-600 font-light leading-relaxed">You agree to indemnify and hold harmless Tomi Jewelry from any claims, damages, liabilities, and expenses (including reasonable attorneys’ fees) arising out of your violation of these Terms or misuse of the Site.</p>
              </div>

              <div>
                  <h3 className="font-heading text-2xl text-stone-900 mb-4">17. Dispute Resolution; Arbitration; Class Action Waiver</h3>
                  <div className="space-y-4 text-stone-600 font-light leading-relaxed">
                    <p className="font-bold uppercase text-xs tracking-widest border-l-2 border-stone-900 pl-3">PLEASE READ THIS SECTION CAREFULLY. IT AFFECTS YOUR RIGHTS.</p>
                    <ul className="space-y-4">
                        <li><strong>Mandatory Binding Arbitration.</strong> Any dispute, claim, or controversy arising out of or relating to these Terms, the Site, or any purchase (a “Dispute”) shall be resolved by binding arbitration administered by the American Arbitration Association (“AAA”) under its consumer arbitration rules, except as noted below.</li>
                        <li><strong>Arbitration Location.</strong> Arbitration will take place in Houston, Texas, or may be conducted virtually/by phone when appropriate.</li>
                        <li><strong>Small Claims Option.</strong> Either party may bring an individual claim in small claims court if it qualifies and remains an individual (non-class) matter.</li>
                        <li><strong>Fees and Costs.</strong> Each party will pay its own attorneys’ fees and costs unless the arbitrator awards otherwise under applicable law. AAA filing and administrative fees are allocated in accordance with AAA rules and applicable law.</li>
                        <li><strong>Class Action Waiver.</strong> You and Tomi Jewelry agree that Disputes will be brought only in an individual capacity and not as a plaintiff or class member in any purported class, collective, consolidated, or representative proceeding. The arbitrator may not consolidate claims or preside over any form of class proceeding.</li>
                    </ul>
                  </div>
              </div>

              <div>
                  <h3 className="font-heading text-2xl text-stone-900 mb-4">18. Governing Law</h3>
                  <p className="text-stone-600 font-light leading-relaxed">These Terms are governed by the laws of the State of Texas, without regard to conflict of laws principles.</p>
              </div>

              <div>
                  <h3 className="font-heading text-2xl text-stone-900 mb-4">19. Electronic Communications</h3>
                  <p className="text-stone-600 font-light leading-relaxed">By using the Site or communicating with us electronically, you consent to receive communications from us electronically. You agree that all agreements, notices, disclosures, and other communications we provide electronically satisfy any legal requirement that such communications be in writing.</p>
              </div>

              <div>
                  <h3 className="font-heading text-2xl text-stone-900 mb-4">20. Changes to These Terms</h3>
                  <p className="text-stone-600 font-light leading-relaxed">We may update these Terms from time to time. The “Last Updated” date indicates when changes were made. Your continued use of the Site after changes means you accept the updated Terms.</p>
              </div>

              <div>
                  <h3 className="font-heading text-2xl text-stone-900 mb-4">21. Contact</h3>
                  <p className="text-stone-600 font-light leading-relaxed">Questions about these Terms should be sent to <a href="mailto:support@tomijewelry.com" className="border-b border-stone-300 hover:border-stone-900 transition-colors">support@tomijewelry.com</a>.</p>
              </div>

            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}


