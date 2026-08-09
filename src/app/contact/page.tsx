"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  GraduationCap,
  ArrowRight,
  MessageCircle,
  Sparkles,
} from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // TODO: Connect to API later for admin panel
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSubmitted(true);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pild-primary via-blue-700 to-blue-900 text-white">
        <div className="absolute inset-0">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-pild-secondary/20 blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20 text-center md:py-28">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
              <MessageCircle className="h-4 w-4 text-pild-secondary" />
              <span className="text-sm font-medium">
                Get in Touch
              </span>
            </div>

            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              Let&apos;s Start a{" "}
              <span className="text-pild-secondary">
                Conversation
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-blue-100 md:text-xl">
              Have a question about our courses, programs, or learning
              experience? Our team is here to help you take the next
              step.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Contact Information */}
          <div className="space-y-6 lg:col-span-1">
            <Card className="overflow-hidden border-0 shadow-xl">
              <CardContent className="p-6 md:p-7">
                <div className="mb-7">
                  <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                    <Mail className="h-5 w-5 text-pild-primary" />
                  </div>

                  <h2 className="text-xl font-bold text-gray-900">
                    Contact Information
                  </h2>

                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    Choose any of the options below and our team will
                    be happy to assist you.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                      <Mail className="h-5 w-5 text-pild-primary" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Email
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        support@pildacademy.com
                      </p>
                      <p className="text-sm text-gray-500">
                        info@pildacademy.com
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                      <Phone className="h-5 w-5 text-pild-primary" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Phone
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        +92-300-1234567
                      </p>
                      <p className="text-sm text-gray-500">
                        +92-321-7654321
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                      <MapPin className="h-5 w-5 text-pild-primary" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Address
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        PILD Academy HQ
                      </p>
                      <p className="text-sm text-gray-500">
                        Lahore, Pakistan
                      </p>
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                      <Clock className="h-5 w-5 text-pild-primary" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Working Hours
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Mon - Sat: 9:00 AM - 6:00 PM
                      </p>
                      <p className="text-sm text-gray-500">
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Help */}
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-pild-primary via-blue-700 to-blue-900 text-white shadow-xl">
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

              <CardContent className="relative z-10 p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                  <GraduationCap className="h-6 w-6 text-pild-secondary" />
                </div>

                <h3 className="text-xl font-bold">
                  Need Quick Help?
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-blue-100">
                  Browse our courses and discover the right learning
                  path for your goals.
                </p>

                <Link href="/courses">
                  <Button
                    className="mt-5 w-full bg-white text-pild-primary hover:bg-gray-100"
                  >
                    View Courses
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl">
              <CardContent className="p-6 md:p-8 lg:p-10">
                {submitted ? (
                  <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
                      <CheckCircle className="h-10 w-10 text-green-500" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                      Message Sent Successfully!
                    </h2>

                    <p className="mx-auto mt-3 max-w-md leading-relaxed text-gray-500">
                      Thank you for contacting PILD Academy. Our team
                      will review your message and get back to you
                      within 24 hours.
                    </p>

                    <Button
                      onClick={() => setSubmitted(false)}
                      variant="outline"
                      className="mt-7"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <div className="mb-3 flex items-center gap-2 text-pild-primary">
                        <Sparkles className="h-5 w-5" />
                        <span className="text-sm font-semibold">
                          We&apos;re Here to Help
                        </span>
                      </div>

                      <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                        Send Us a Message
                      </h2>

                      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
                        Fill out the form below and tell us how we can
                        help. We will get back to you as soon as
                        possible.
                      </p>
                    </div>

                    <form
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      {/* Name + Email */}
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">
                            Full Name
                          </Label>

                          <Input
                            id="name"
                            name="name"
                            placeholder="Enter your full name"
                            required
                            className="h-12"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">
                            Email Address
                          </Label>

                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your@email.com"
                            required
                            className="h-12"
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          Phone Number{" "}
                          <span className="text-gray-400">
                            (Optional)
                          </span>
                        </Label>

                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+92-300-1234567"
                          className="h-12"
                        />
                      </div>

                      {/* Subject */}
                      <div className="space-y-2">
                        <Label htmlFor="subject">
                          Subject
                        </Label>

                        <Input
                          id="subject"
                          name="subject"
                          placeholder="How can we help you?"
                          required
                          className="h-12"
                        />
                      </div>

                      {/* Message */}
                      <div className="space-y-2">
                        <Label htmlFor="message">
                          Message
                        </Label>

                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Tell us more about your inquiry..."
                          rows={7}
                          required
                          className="resize-none"
                        />
                      </div>

                      {/* Submit */}
                      <Button
                        type="submit"
                        disabled={loading}
                        className="h-12 w-full bg-pild-primary text-base hover:bg-pild-primary/90"
                      >
                        {loading ? (
                          <>
                            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </Button>

                      <p className="text-center text-xs text-gray-400">
                        We normally respond within 24 hours.
                      </p>
                    </form>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t bg-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="mx-auto max-w-2xl">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
              <GraduationCap className="h-7 w-7 text-pild-primary" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Ready to Start Learning?
            </h2>

            <p className="mt-3 leading-relaxed text-gray-500">
              Explore our courses and find the skills that can help
              you move closer to your career goals.
            </p>

            <Link href="/courses">
              <Button
                size="lg"
                className="mt-6 bg-pild-primary hover:bg-pild-primary/90"
              >
                Explore Courses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}