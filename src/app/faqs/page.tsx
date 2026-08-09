export default function FAQsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-blue-700 to-purple-700 py-20 text-center text-white">
        <h1 className="text-4xl font-bold">
          Frequently Asked Questions
        </h1>

        <p className="mt-4 text-blue-100">
          Find answers to common questions about PILD Academy.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16">
        <div className="space-y-6">

          <div className="rounded-xl border p-6 shadow-sm">
            <h2 className="text-lg font-semibold">
              What courses does PILD Academy offer?
            </h2>

            <p className="mt-2 text-gray-600">
              PILD Academy offers career oriented courses and learning
              programs designed to help students develop practical skills.
            </p>
          </div>

          <div className="rounded-xl border p-6 shadow-sm">
            <h2 className="text-lg font-semibold">
              How can I enroll in a course?
            </h2>

            <p className="mt-2 text-gray-600">
              Open the Courses section, select your desired course,
              review the course information, and click the enrollment option.
            </p>
          </div>

          <div className="rounded-xl border p-6 shadow-sm">
            <h2 className="text-lg font-semibold">
              Do I receive a certificate?
            </h2>

            <p className="mt-2 text-gray-600">
              Certificate availability depends on the specific course
              and its completion requirements.
            </p>
          </div>

          <div className="rounded-xl border p-6 shadow-sm">
            <h2 className="text-lg font-semibold">
              How can I contact PILD Academy?
            </h2>

            <p className="mt-2 text-gray-600">
              You can contact PILD Academy through the Contact Us page
              for assistance and further information.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}