export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-blue-700 to-purple-700 py-20 text-center text-white">
        <h1 className="text-4xl font-bold sm:text-5xl">
          Terms & Conditions
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-blue-100">
          Please review the terms that apply when using PILD Academy.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16">
        <div className="space-y-10 text-gray-700">

          <div>
            <h2 className="mb-3 text-2xl font-bold text-gray-900">
              1. Use of the Website
            </h2>

            <p className="leading-7">
              By using the PILD Academy website, you agree to use the platform
              responsibly and in accordance with these terms.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-bold text-gray-900">
              2. User Accounts
            </h2>

            <p className="leading-7">
              Users are responsible for maintaining the confidentiality of
              their account credentials and for activities performed through
              their accounts.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-bold text-gray-900">
              3. Courses and Learning Content
            </h2>

            <p className="leading-7">
              Course materials provided through PILD Academy are intended for
              educational purposes. Users should not reproduce, redistribute,
              or misuse protected course content without permission.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-bold text-gray-900">
              4. Enrollment and Payments
            </h2>

            <p className="leading-7">
              Course enrollment and payment terms may vary depending on the
              specific course. Users should review the information provided
              on the relevant course page before enrolling.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-bold text-gray-900">
              5. Changes to These Terms
            </h2>

            <p className="leading-7">
              PILD Academy may update these terms when necessary. Updated
              terms will be published on this page.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-bold text-gray-900">
              6. Contact
            </h2>

            <p className="leading-7">
              If you have questions regarding these Terms & Conditions,
              please contact PILD Academy.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}