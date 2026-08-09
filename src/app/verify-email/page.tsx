import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  if (!searchParams.token) {
    redirect("/login");
  }

  const tokenRecord = await prisma.verificationToken.findUnique({
    where: { token: searchParams.token },
  });

  if (!tokenRecord || tokenRecord.expires < new Date()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md text-center p-6">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Invalid or Expired Link</h2>
          <p className="text-gray-500 mb-4">This verification link is no longer valid.</p>
          <Link href="/login">
            <Button variant="outline">Back to Login</Button>
          </Link>
        </Card>
      </div>
    );
  }

  await prisma.user.update({
    where: { email: tokenRecord.identifier },
    data: { emailVerified: new Date() },
  });

  await prisma.verificationToken.delete({
    where: { token: searchParams.token },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md text-center p-6">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Email Verified!</h2>
        <p className="text-gray-500 mb-6">Your account is now active. You can sign in.</p>
        <Link href="/login">
          <Button className="bg-pild-primary">Sign In Now</Button>
        </Link>
      </Card>
    </div>
  );
}
