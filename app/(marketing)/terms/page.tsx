"use client";

export default function TermsPage() {
  return (
    <div className="h-screen bg-black px-4 md:px-6 pt-16 md:pt-24 pb-8 md:pb-16 overflow-hidden">
      <div className="mx-auto max-w-4xl h-full flex flex-col">
        {/* Header */}
        <div className="text-center mb-8 flex-shrink-0">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            TERMS OF SERVICE
          </h1>
          <p className="text-gray-400 text-sm">Effective Date: 1/7/2025</p>
        </div>

        {/* Card Container */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl flex-1 flex flex-col min-h-0">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 lg:p-10">
            <div className="space-y-8 text-gray-300">
              <div className="prose prose-invert max-w-none">
                <p className="text-lg leading-relaxed">
                  Welcome to Ballers Pak (&quot;Company,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). These Terms of Service (&quot;Terms&quot;) govern your access to and use of our website and services, including but not limited to online football training programs, video content, live mentorship sessions, downloadable materials, and access to professional players (collectively, the &quot;Services&quot;).
                </p>
                <p className="text-md leading-relaxed mt-4">
                  By accessing or using our Services, you agree to be bound by these Terms. If you do not agree, do not use the Services.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <span className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center text-sm font-bold mr-3">1</span>
                    Eligibility & Account Responsibility
                  </h2>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white mb-2">1.1. Use by Minors</h3>
                    <p className="text-gray-300 mb-4">
                      Our Services are designed for children and young athletes under the age of 18. A parent or legal guardian must create the account, make any payments, and consent to the child&apos;s participation in accordance with applicable laws, including the U.S. Children&apos;s Online Privacy Protection Act (COPPA) and similar international regulations.
                    </p>
                    <p className="text-gray-300 mb-3">By registering your child, you affirm that:</p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>You are the child&apos;s parent or legal guardian.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>You consent to the child&apos;s use of the Services.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>You accept full responsibility for the child&apos;s activity on the platform.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <span className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center text-sm font-bold mr-3">2</span>
                    Parental Consent & Data Use
                  </h2>
                  <p className="text-gray-300 mb-4">
                    We collect limited personal information from minors only after obtaining verifiable parental consent. This includes name, age, video uploads, progress tracking, and communication within the platform.
                  </p>
                  <p className="text-gray-300">
                    We do not sell or share personal data with third parties for marketing. Please review our Privacy Policy for full details.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <span className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center text-sm font-bold mr-3">3</span>
                    Service Overview
                  </h2>
                  <p className="text-gray-300 mb-3">Our Services include:</p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Access to pre-recorded football training programs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Monthly live sessions with elite professional players</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>One-on-one or group mentorship with coaches</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Tactical, technical, and mindset development resources</span>
                    </li>
                  </ul>
                  <p className="text-gray-300 mb-4">
                    These are delivered digitally through our website or mobile-optimized platform.
                  </p>
                  <p className="text-gray-300">
                    We may update or modify our content and features at any time to improve user experience.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <span className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center text-sm font-bold mr-3">4</span>
                    Fees, Payments & Currency
                  </h2>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white mb-2">4.1. Pricing and Billing</h3>
                    <p className="text-gray-300 mb-4">
                      All Services are offered for a recurring or one-time fee. Prices may be listed in USD and/or local currencies (e.g., PKR). We use secure third-party payment processors (such as Stripe) and comply with PCI-DSS standards.
                    </p>
                    <p className="text-gray-300 mb-4">
                      By submitting payment, you authorize us to charge your chosen payment method for the stated fee.
                    </p>
                    <h3 className="text-lg font-semibold text-white mb-2">4.2. Taxes and Withholding</h3>
                    <p className="text-gray-300">
                      You are responsible for any local taxes, including withholding tax on international transactions where applicable. We do not provide localized tax advice.
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <span className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center text-sm font-bold mr-3">5</span>
                    Cancellations and Refunds
                  </h2>
                  <p className="text-gray-300 mb-4">
                    We offer a 7-day refund policy on new subscriptions. Refund requests must be submitted in writing to <a href="mailto:admin@ballerspak.com" className="text-primary hover:text-primary/80 transition-colors underline">admin@ballerspak.com</a> with the parent&apos;s full name and transaction ID.
                  </p>
                  <p className="text-gray-300 mb-3">Refunds will not be granted for:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Missed sessions due to your own technical issues</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Partial use of the service</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Disqualifications due to violations of our Code of Conduct</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <span className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center text-sm font-bold mr-3">6</span>
                    Name, Image, and Likeness
                  </h2>
                  <p className="text-gray-300 mb-4">
                    We may record and publish training sessions or community content that include participant video, audio, or chat interactions. By participating, you (and your child) grant us a non-exclusive, worldwide, royalty-free license to use this material for educational and promotional purposes.
                  </p>
                  <p className="text-gray-300">
                    You may revoke consent at any time by emailing us at <a href="mailto:admin@ballerspak.com" className="text-primary hover:text-primary/80 transition-colors underline">admin@ballerspak.com</a>, and we will cease future use (previously published materials may remain archived).
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <span className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center text-sm font-bold mr-3">7</span>
                    Community Conduct
                  </h2>
                  <p className="text-gray-300 mb-3">We expect respectful and sportsmanlike behavior at all times. You agree that neither you nor your child will:</p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Harass, abuse, or bully other users or staff</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Share login credentials</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Upload inappropriate or copyrighted materials</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Disrupt live sessions or coaching events</span>
                    </li>
                  </ul>
                  <p className="text-gray-300">
                    Violations may result in suspension or termination without refund.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <span className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center text-sm font-bold mr-3">8</span>
                    Intellectual Property
                  </h2>
                  <p className="text-gray-300 mb-4">
                    All content, including training videos, curriculum, images, logos, and code, is owned by Ballers Pak Ltd or its licensors. You may not copy, resell, redistribute, or reverse-engineer any part of our Services.
                  </p>
                  <p className="text-gray-300">
                    You may only use our content for personal, non-commercial purposes unless you have our express written permission.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <span className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center text-sm font-bold mr-3">9</span>
                    Disclaimers and Limitation of Liability
                  </h2>
                  <p className="text-gray-300 mb-3">We strive to provide high-quality training, but:</p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>We do not guarantee admission to professional clubs or scholarships.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Physical training involves risks; participants must be medically fit.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>You are solely responsible for ensuring the training is suitable for your child.</span>
                    </li>
                  </ul>
                  <p className="text-gray-300">
                    To the fullest extent permitted by law, we disclaim all warranties, and our liability is limited to the amount you paid for the Services in the previous 6 months.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <span className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center text-sm font-bold mr-3">10</span>
                    Governing Law and Jurisdiction
                  </h2>
                  <p className="text-gray-300">
                    These Terms are governed by the laws of the State of Delaware, United States, without regard to conflict of laws. You agree to submit to the exclusive jurisdiction of courts located in New York County, New York, for any dispute.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <span className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center text-sm font-bold mr-3">11</span>
                    International Users
                  </h2>
                  <p className="text-gray-300 mb-4">
                    If you are accessing our Services from outside the U.S., you do so at your own risk. You are responsible for compliance with local laws and regulations, including data privacy, tax, and internet use laws.
                  </p>
                  <p className="text-gray-300">
                    We do not offer our Services to users located in countries subject to comprehensive U.S. sanctions.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <span className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center text-sm font-bold mr-3">12</span>
                    Modifications
                  </h2>
                  <p className="text-gray-300">
                    We reserve the right to modify these Terms at any time. We will notify users via email or prominent site notice. Your continued use of the Services constitutes acceptance of the updated Terms.
                  </p>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <span className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center text-sm font-bold mr-3">13</span>
                    Contact Information
                  </h2>
                  <p className="mb-4 text-gray-300">For questions, complaints, or legal inquiries, please contact:</p>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 space-y-2">
                    <p className="text-gray-300">
                      <strong className="text-white">Ballers Pak LLC</strong>
                    </p>
                    <p className="text-gray-300">
                      Registered Agent Address (on file in the United States)
                    </p>
                    <p className="text-gray-300">
                      📧 Email: <a href="mailto:admin@ballerspak.com" className="text-primary hover:text-primary/80 transition-colors underline">admin@ballerspak.com</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        body {
          overflow: hidden;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
} 