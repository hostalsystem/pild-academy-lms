"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Upload, CheckCircle, Wallet, Building2, Smartphone } from "lucide-react";
import Image from "next/image";

type PaymentMethod = "EASYPAYSA" | "JAZZCASH" | "UBL_BANK";

const paymentMethods = [
  {
    id: "EASYPAYSA" as PaymentMethod,
    name: "EasyPaisa",
    icon: Smartphone,
    color: "bg-green-600",
    accountTitle: "PILD Academy",
    accountNumber: "0345-1234567",
    instructions: "Open EasyPaisa app → Send Money → Enter number → Enter amount → Note your Transaction ID",
  },
  {
    id: "JAZZCASH" as PaymentMethod,
    name: "JazzCash",
    icon: Wallet,
    color: "bg-red-600",
    accountTitle: "PILD Academy",
    accountNumber: "0300-9876543",
    instructions: "Open JazzCash app → Send Money → Enter number → Enter amount → Note your Transaction ID",
  },
  {
    id: "UBL_BANK" as PaymentMethod,
    name: "UBL Bank Account",
    icon: Building2,
    color: "bg-blue-700",
    accountTitle: "PILD Academy Pvt Ltd",
    accountNumber: "1234-5678901234",
    iban: "PK36UNIL1234000123456789",
    instructions: "Deposit cash or transfer online to the account above. Note the Transaction/Reference number.",
  },
];

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Auth check
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=/payment/${courseId}`);
    }
  }, [status, router, courseId]);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await fetch(`/api/courses/${courseId}`);
        if (!res.ok) throw new Error("Course not found");
        const data = await res.json();
        setCourse(data);
      } catch (e) {
        setError("Failed to load course details");
      } finally {
        setLoading(false);
      }
    }
    if (status === "authenticated") {
      fetchCourse();
    }
  }, [courseId, status]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }
      setScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => setScreenshotPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!selectedMethod) {
      setError("Please select a payment method");
      return;
    }
    if (!transactionId.trim()) {
      setError("Please enter the transaction ID");
      return;
    }
    if (!screenshot) {
      setError("Please upload payment screenshot");
      return;
    }

    setSubmitting(true);

    try {
      const screenshotUrl = screenshotPreview || "";

      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          method: selectedMethod,
          transactionId: transactionId.trim(),
          screenshotUrl,
          amount: course?.fee || 0,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Payment submission failed");
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-pild-primary" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md text-center p-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Payment Submitted!</h2>
          <p className="text-gray-500 mb-4">
            Your payment is pending verification. You will be notified once admin approves it.
          </p>
          <Button onClick={() => router.push("/dashboard")} className="bg-pild-primary">
            Go to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const selectedMethodData = paymentMethods.find((m) => m.id === selectedMethod);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Complete Your Enrollment</h1>

        {course && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                  {course.thumbnail ? (
                    <Image src={course.thumbnail} alt={course.title} fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{course.title}</h2>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{course.description}</p>
                  <div className="mt-3 flex items-center gap-4">
                    <Badge variant="secondary">{course.duration}</Badge>
                    <span className="text-lg font-bold text-pild-primary">PKR {course.fee?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Select Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                      selectedMethod === method.id
                        ? "border-pild-primary bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full ${method.color} flex items-center justify-center mb-3`}>
                      <method.icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold">{method.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">Click to select</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedMethodData && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertDescription>{selectedMethodData.instructions}</AlertDescription>
                </Alert>

                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Title:</span>
                    <span className="font-medium">{selectedMethodData.accountTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Number:</span>
                    <span className="font-medium">{selectedMethodData.accountNumber}</span>
                  </div>
                  {"iban" in selectedMethodData && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">IBAN:</span>
                      <span className="font-medium">{selectedMethodData.iban}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-600">Amount to Pay:</span>
                    <span className="font-bold text-pild-primary">PKR {course?.fee?.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Payment Proof</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="transactionId">Transaction ID / Reference Number *</Label>
                <Input
                  id="transactionId"
                  placeholder="e.g. EP123456789"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Payment Screenshot *</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    screenshotPreview ? "border-pild-primary bg-blue-50" : "border-gray-300 hover:border-gray-400"
                  }`}
                  onClick={() => document.getElementById("screenshot")?.click()}
                >
                  <input
                    id="screenshot"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  {screenshotPreview ? (
                    <div className="relative w-full h-48">
                      <Image src={screenshotPreview} alt="Screenshot preview" fill className="object-contain" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-500">Click to upload payment screenshot</p>
                      <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full h-12 text-lg bg-pild-primary hover:bg-pild-primary/90"
            disabled={submitting}
          >
            {submitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
            Submit Payment
          </Button>
        </form>
      </div>
    </div>
  );
}