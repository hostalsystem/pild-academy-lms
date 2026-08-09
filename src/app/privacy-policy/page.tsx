export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-blue-700 to-purple-700 py-20 text-center text-white">
        <h1 className="text-4xl font-bold sm:text-5xl">
          Privacy Policy
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-blue-100">
          Learn how PILD Academy collects, uses, and protects your information.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16">
        <div className="space-y-10 text-gray-700">

          <div>
            <h2 className="mb-3 text-2xl font-bold text-gray-900">
              1. Information We Collect
            </h2>

            <p className="leading-7">
              When you register, enroll in a course, or contact PILD Academy,
              we may collect information such as your name, email address,
              contact information, and information required to provide our
              educational services.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-bold text-gray-900">
              2. How We Use Your Information
            </h2>

            <p className="leading-7">
              Your information may be used to manage your account, provide
              courses and learning services, process enrollments, communicate
              with you, and improve the PILD Academy platform.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-bold text-gray-900">
              3. Data Protection
            </h2>

            <p className="leading-7">
              PILD Academy takes reasonable measures to protect user
              information and prevent unauthorized access, modification,
              disclosure, or misuse.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-bold text-gray-900">
              4. Contact Us
            </h2>

            <p className="leading-7">
              If you have questions about this Privacy Policy, please contact
              PILD Academy through our Contact Us page.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}