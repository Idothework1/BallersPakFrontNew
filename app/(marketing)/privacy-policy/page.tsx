"use client";

export default function PrivacyPolicyPage() {
  return (
    <div className="h-screen bg-black px-4 md:px-6 pt-16 md:pt-24 pb-8 md:pb-16 overflow-hidden">
      <div className="mx-auto max-w-4xl h-full flex flex-col">
        {/* Header */}
        <div className="text-center mb-8 flex-shrink-0">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            PARENTAL CONTROL & PRIVACY POLICY
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
                  Ballers Pak LLC (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting the privacy and safety of children who use our online football training programs. Because many of our users are minors (under the age of 18), this policy outlines how we collect, use, store, and protect their personal information — and what rights parents and legal guardians have regarding their child&apos;s data.
                </p>
                <p className="text-md leading-relaxed mt-4">
                  This policy is designed to comply with:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-3">
                  <li>COPPA (Children&apos;s Online Privacy Protection Act – U.S. law)</li>
                  <li>Applicable GDPR protections for users in the European Union</li>
                  <li>Local expectations for parental consent and child safety in South Asia</li>
                </ul>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <span className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center text-sm font-bold mr-3">1</span>
                    Who We Are
                  </h2>
                  <p className="text-gray-300">
                    Ballers Pak LLC is a U.S.-registered company providing digital football training programs to aspiring young players worldwide — with a focus on South Asia. Our platform connects youth athletes to elite training content and mentorship from Champions League players and coaches.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <span className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center text-sm font-bold mr-3">2</span>
                    What Information We Collect from Children
                  </h2>
                  <p className="mb-4 text-gray-300">We only collect limited, essential information to provide our services. Examples of child data we may collect include:</p>
                  
                  <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700">
                    <table className="w-full">
                      <thead className="bg-gray-700/50">
                        <tr>
                          <th className="text-left p-4 text-white font-semibold">Category</th>
                          <th className="text-left p-4 text-white font-semibold">Examples</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-300">
                        <tr className="border-t border-gray-600">
                          <td className="p-4 font-medium">Identity</td>
                          <td className="p-4">First name, age, gender, country</td>
                        </tr>
                        <tr className="border-t border-gray-600">
                          <td className="p-4 font-medium">Content</td>
                          <td className="p-4">Uploaded videos, training logs, progress notes</td>
                        </tr>
                        <tr className="border-t border-gray-600">
                          <td className="p-4 font-medium">Platform Use</td>
                          <td className="p-4">Session views, completed activities, quiz responses</td>
                        </tr>
                        <tr className="border-t border-gray-600">
                          <td className="p-4 font-medium">Communication</td>
                          <td className="p-4">Messages to coaches (monitored & moderated)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <p className="text-gray-300 mt-4">
                    We do not knowingly collect addresses, phone numbers, or sensitive personal information from minors.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <span className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center text-sm font-bold mr-3">3</span>
                    Parental Consent (COPPA Compliance)
                  </h2>
                  <p className="mb-4 text-gray-300">We require verifiable parental or guardian consent before collecting any personal data from a child. Consent is gathered through:</p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Parent or guardian creating the child&apos;s account</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Verification of parental email and acceptance of our Terms & Privacy Policies</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Confirmation through payment method, if applicable</span>
                    </li>
                  </ul>
                  <p className="text-gray-300 mt-4">
                    If consent is not obtained, no data is collected and the child cannot access the platform.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <span className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center text-sm font-bold mr-3">4</span>
                    How We Use Children&apos;s Information
                  </h2>
                  <p className="mb-4 text-gray-300">We use this data only for purposes related to delivering a secure, educational, and personalized training experience:</p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Providing training materials, video sessions, and feedback</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Tracking improvement and suggesting relevant programs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Enabling mentorship and coach communication</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Ensuring safety and monitoring platform behavior</span>
                    </li>
                  </ul>
                  <p className="text-gray-300 mt-4">
                    We do not use children&apos;s data for advertising, nor do we sell or rent any personal data to third parties.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <span className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center text-sm font-bold mr-3">5</span>
                    Who Has Access to Child Data
                  </h2>
                  <p className="mb-4 text-gray-300">We strictly control access to children&apos;s information. It may be accessed only by:</p>
                  
                  <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700">
                    <table className="w-full">
                      <thead className="bg-gray-700/50">
                        <tr>
                          <th className="text-left p-4 text-white font-semibold">Who</th>
                          <th className="text-left p-4 text-white font-semibold">Why</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-300">
                        <tr className="border-t border-gray-600">
                          <td className="p-4 font-medium">Ballers Pak staff</td>
                          <td className="p-4">For managing content, safety, and technical support</td>
                        </tr>
                        <tr className="border-t border-gray-600">
                          <td className="p-4 font-medium">Verified coaches and mentors</td>
                          <td className="p-4">To provide training, feedback, and mentorship</td>
                        </tr>
                        <tr className="border-t border-gray-600">
                          <td className="p-4 font-medium">Parents/Guardians</td>
                          <td className="p-4">To monitor progress and update info</td>
                        </tr>
                        <tr className="border-t border-gray-600">
                          <td className="p-4 font-medium">Third-party service providers</td>
                          <td className="p-4">To host platform securely (e.g. AWS, Vimeo), under data privacy contracts</td>
                        </tr>
                        <tr className="border-t border-gray-600">
                          <td className="p-4 font-medium">Legal authorities</td>
                          <td className="p-4">Only if required for safety or legal compliance</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <p className="text-gray-300 mt-4">
                    All service providers are required to comply with U.S. COPPA and international privacy standards.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <span className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center text-sm font-bold mr-3">6</span>
                    Parent Rights and Controls
                  </h2>
                  <p className="mb-4 text-gray-300">Parents and legal guardians have the full right to control their child&apos;s data and participation. These rights include:</p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Reviewing the personal information we&apos;ve collected</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Updating or correcting inaccurate information</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Withdrawing consent and requesting account deletion</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Limiting or revoking communication between their child and coaches</span>
                    </li>
                  </ul>
                  <p className="text-gray-300 mt-4">
                    To exercise these rights, contact us at: <a href="mailto:admin@ballerspak.com" className="text-primary hover:text-primary/80 transition-colors underline">admin@ballerspak.com</a>
                  </p>
                  <p className="text-gray-300 mt-2">
                    We respond to all verified parental requests within 7 business days.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <span className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center text-sm font-bold mr-3">7</span>
                    Data Security & Retention
                  </h2>
                  <p className="text-gray-300 mb-4">
                    We use industry-standard encryption, secure cloud servers, and internal access controls to protect your child&apos;s data.
                  </p>
                  <p className="text-gray-300">
                    All child data is stored securely in the United States. Data is retained only as long as needed to provide the service or as required by law, then permanently deleted.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <span className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center text-sm font-bold mr-3">8</span>
                    Deletion Policy
                  </h2>
                  <p className="mb-4 text-gray-300">If a parent or guardian requests deletion of their child&apos;s information:</p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>The account and all associated data will be permanently deleted within 10 business days</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>You may request written confirmation once deletion is complete</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Some non-identifiable usage data may be retained for system optimization</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <span className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center text-sm font-bold mr-3">9</span>
                    International Users
                  </h2>
                  <p className="text-gray-300 mb-4">
                    Our servers and operations are located in the United States. By using our platform, users outside the U.S. (including those in South Asia or the EU) agree to the transfer and processing of their data in accordance with this policy.
                  </p>
                  <p className="text-gray-300">
                    We apply Standard Contractual Clauses or equivalent legal safeguards when required for cross-border data transfers.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <span className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center text-sm font-bold mr-3">10</span>
                    Policy Changes
                  </h2>
                  <p className="text-gray-300 mb-4">
                    We may revise this policy to stay aligned with legal requirements or service improvements. Parents and guardians will be notified by email and/or platform notification in case of significant changes.
                  </p>
                  <p className="text-gray-300">
                    We recommend reviewing this page periodically.
                  </p>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <span className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center text-sm font-bold mr-3">11</span>
                    Contact Information
                  </h2>
                  <p className="mb-4 text-gray-300">If you have any questions, concerns, or would like to manage your child&apos;s data:</p>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 space-y-2">
                    <p className="text-gray-300">
                      <strong className="text-white">Ballers Pak LLC</strong>
                    </p>
                    <p className="text-gray-300">
                      📧 Email: <a href="mailto:info@ballerspak.com" className="text-primary hover:text-primary/80 transition-colors underline">info@ballerspak.com</a>
                    </p>
                    <p className="text-gray-300">
                      📍 Mailing Address: Available upon verified request by parents or guardians
                    </p>
                    <p className="text-gray-300">
                      📞 Phone: Not available at this time
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