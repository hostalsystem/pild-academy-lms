"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, CheckCircle, Upload, Smartphone, Building, Wallet } from "lucide-react";

const paymentMethods = [
  {
    id: "EASYPAYSA",
    name: "EasyPaisa",
    icon: Smartphone,
    instructions: "Send payment to EasyPaisa account: 03XX-XXXXXXX",
    accountNumber: "03XX-XXXXXXX",
    accountName: "PILD Academy",
  },
  {
    id: "JAZZCASH",
    name: "JazzCash",
    icon: Wallet,
    instructions: "Send payment to JazzCash account: 03XX-XXXXXXX",
    accountNumber: "03XX-XXXXXXX",
    accountName: "PILD Academy",
  },
  {
    id: "UBL_BANK",
    name: "UBL Bank Account",
    icon: Building,
    instructions: "Transfer to UBL Bank Account",
    accountNumber: "1234-5678-9012-3456",
    accountName: "PILD Academy",
    iban: "PK00-UBL-0000-0000-0000-0000",
  },
];

interface PaymentFormProps {
  courseId: string;
  enrollmentId: string;
  amount: number;
}

export function PaymentForm({ courseId, enrollmentId, amount }: PaymentFormProps) {
  const router = useRouter();
  const [method, setMethod] = useState("EASYPAYSA");
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const selectedMethod = paymentMethods.find((m) => m.id === method);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!transactionId.trim()) {
      setError("Please enter the transaction ID");
      setLoading(false);
      return;
    }

    try {
      // In a real app, upload screenshot to Cloudinary first
      // For now, we'll skip the actual file upload and just store the transaction ID
      const screenshotUrl = screenshot ? "pending-upload" : null;

      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          enrollmentId,
          amount,
          method,
          transactionId,
          screenshotUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to submit payment");
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  if (success) {
    return (
      <Card className="text-center p-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Payment Submitted!</h2>
        <p className="text-gray-500 mb-6">
          Your payment proof has been submitted for verification. You will receive an email once admin approves your payment.
        </p>
        <div className="space-y-2">
          <Button onClick={() => router.push("/dashboard")} className="bg-pild-primary">
            Go to Dashboard
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <RadioGroup value={method} onValueChange={setMethod} className="space-y-3">
            {paymentMethods.map((pm) => (
              <div key={pm.id} className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value={pm.id} id={pm.id} />
                <Label htmlFor={pm.id} className="flex items-center gap-3 cursor-pointer flex-1">
                  <pm.icon className="h-5 w-5 text-pild-primary" />
                  <div>
                    <p className="font-medium">{pm.name}</p>
                    <p className="text-xs text-gray-500">{pm.instructions}</p>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>

          {selectedMethod && (
            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-sm">Payment Instructions</h4>
              <p className="text-sm text-gray-600">{selectedMethod.instructions}</p>
              <div className="text-sm">
                <p>
                  <span className="font-medium">Account Name:</span> {selectedMethod.accountName}
                </p>
                <p>
                  <span className="font-medium">Account Number:</span> {selectedMethod.accountNumber}
                </p>
                {selectedMethod.iban && (
                  <p>
                    <span className="font-medium">IBAN:</span> {selectedMethod.iban}
                  </p>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Amount to send: <span className="font-bold text-pild-primary">PKR {amount.toLocaleString()}</span>
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="transactionId">Transaction ID / Reference Number</Label>
            <Input
              id="transactionId"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter transaction ID from your payment"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="screenshot">Payment Screenshot (Optional)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <Input
                id="screenshot"
                type="file"
                accept="image/*"
                onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                className="hidden"
              />
              <Label htmlFor="screenshot" className="cursor-pointer text-sm text-gray-600">
                {screenshot ? screenshot.name : "Click to upload screenshot"}
              </Label>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-pild-primary hover:bg-pild-primary/90 h-12 text-lg"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
            Submit Payment Proof
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}