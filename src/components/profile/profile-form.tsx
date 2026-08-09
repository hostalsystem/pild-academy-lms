"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, User, Phone, MapPin, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProfileImageUpload } from "./profile-image-upload";

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  phone: string | null;
  address: string | null;
  role: string;
  createdAt: Date;
}

interface ProfileFormProps {
  initialUser: UserProfile;
}

export function ProfileForm({ initialUser }: ProfileFormProps) {
  const router = useRouter();
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.name,
          phone: user.phone,
          address: user.address,
          image: user.image,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        router.refresh();
      } else {
        setMessage({ type: "error", text: data.error || "Update failed" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="h-5 w-5 text-pild-primary" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <ProfileImageUpload
            currentImage={user.image}
            onUpload={(url) => setUser({ ...user, image: url })}
          />
        </div>

        {message && (
          <Alert
            variant={message.type === "error" ? "destructive" : "default"}
            className={
              message.type === "success" ? "bg-green-50 text-green-800 border-green-200" : ""
            }
          >
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <User className="h-3.5 w-3.5" />
              Full Name
            </Label>
            <Input
              value={user.name || ""}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              placeholder="Your full name"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <Mail className="h-3.5 w-3.5" />
              Email
            </Label>
            <Input value={user.email} disabled className="bg-gray-50 text-gray-500" />
            <p className="text-xs text-gray-400">Email cannot be changed</p>
          </div>

          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <Phone className="h-3.5 w-3.5" />
              Phone Number
            </Label>
            <Input
              value={user.phone || ""}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              placeholder="e.g. +92 300 1234567"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <MapPin className="h-3.5 w-3.5" />
              Address
            </Label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={user.address || ""}
              onChange={(e) => setUser({ ...user, address: e.target.value })}
              placeholder="Your address"
              rows={3}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <Shield className="h-3.5 w-3.5" />
              Role
            </Label>
            <Input
              value={user.role}
              disabled
              className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide"
            />
          </div>

          <Button
            type="submit"
            className="bg-pild-primary gap-2"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}