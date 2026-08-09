"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Loader2,
  GraduationCap,
  CreditCard,
  Globe,
  Wrench,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

interface SettingsData {
  academyName: string;
  academyTagline: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  facebookUrl: string;
  youtubeUrl: string;
  linkedinUrl: string;
  whatsappNumber: string;
  easypaisaNumber: string;
  jazzcashNumber: string;
  ublAccount: string;
  maintenanceMode: string;
  allowRegistration: string;
  defaultCourseFee: string;
}

const DEFAULT_SETTINGS: SettingsData = {
  academyName: "PILD Academy",
  academyTagline: "Professional Institute of Learning & Development",
  contactEmail: "",
  contactPhone: "",
  contactAddress: "",
  facebookUrl: "",
  youtubeUrl: "",
  linkedinUrl: "",
  whatsappNumber: "",
  easypaisaNumber: "",
  jazzcashNumber: "",
  ublAccount: "",
  maintenanceMode: "false",
  allowRegistration: "true",
  defaultCourseFee: "15000",
};

export function SettingsClient() {
  const router = useRouter();
  const [settings, setSettings] = useState<SettingsData>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.settings) {
        setSettings({ ...DEFAULT_SETTINGS, ...data.settings });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setMessage({ type: "success", text: "Settings saved successfully!" });
        router.refresh();
      } else {
        setMessage({ type: "error", text: "Failed to save settings" });
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong" });
    } finally {
      setSaving(false);
    }
  };

  const update = (key: keyof SettingsData, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const toggle = (key: "maintenanceMode" | "allowRegistration") => {
    setSettings((prev) => ({
      ...prev,
      [key]: prev[key] === "true" ? "false" : "true",
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <Alert
          variant={message.type === "error" ? "destructive" : "default"}
          className={message.type === "success" ? "bg-green-50 text-green-800 border-green-200" : ""}
        >
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Academy Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-pild-primary" />
            Academy Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Academy Name</Label>
            <Input
              value={settings.academyName}
              onChange={(e) => update("academyName", e.target.value)}
              placeholder="PILD Academy"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Tagline</Label>
            <Input
              value={settings.academyTagline}
              onChange={(e) => update("academyTagline", e.target.value)}
              placeholder="Your academy tagline"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> Contact Email
              </Label>
              <Input
                value={settings.contactEmail}
                onChange={(e) => update("contactEmail", e.target.value)}
                placeholder="support@pildacademy.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" /> Contact Phone
              </Label>
              <Input
                value={settings.contactPhone}
                onChange={(e) => update("contactPhone", e.target.value)}
                placeholder="+92 300 1234567"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> Address
            </Label>
            <Input
              value={settings.contactAddress}
              onChange={(e) => update("contactAddress", e.target.value)}
              placeholder="Academy address"
            />
          </div>
        </CardContent>
      </Card>

      {/* Social & WhatsApp */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-5 w-5 text-pild-primary" />
            Social Links & WhatsApp
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Facebook URL</Label>
              <Input
                value={settings.facebookUrl}
                onChange={(e) => update("facebookUrl", e.target.value)}
                placeholder="https://facebook.com/..."
              />
            </div>
            <div className="space-y-1.5">
              <Label>YouTube URL</Label>
              <Input
                value={settings.youtubeUrl}
                onChange={(e) => update("youtubeUrl", e.target.value)}
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>LinkedIn URL</Label>
              <Input
                value={settings.linkedinUrl}
                onChange={(e) => update("linkedinUrl", e.target.value)}
                placeholder="https://linkedin.com/..."
              />
            </div>
            <div className="space-y-1.5">
              <Label>WhatsApp Number</Label>
              <Input
                value={settings.whatsappNumber}
                onChange={(e) => update("whatsappNumber", e.target.value)}
                placeholder="+92 300 1234567"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-pild-primary" />
            Payment Accounts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-green-700">
                <DollarSign className="h-4 w-4" /> EasyPaisa Number
              </Label>
              <Input
                value={settings.easypaisaNumber}
                onChange={(e) => update("easypaisaNumber", e.target.value)}
                placeholder="03XX XXXXXXX"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-pild-secondary">
                <DollarSign className="h-4 w-4" /> JazzCash Number
              </Label>
              <Input
                value={settings.jazzcashNumber}
                onChange={(e) => update("jazzcashNumber", e.target.value)}
                placeholder="03XX XXXXXXX"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-blue-700">
                <DollarSign className="h-4 w-4" /> UBL Account / IBAN
              </Label>
              <Input
                value={settings.ublAccount}
                onChange={(e) => update("ublAccount", e.target.value)}
                placeholder="PKXX UBL..."
              />
            </div>
          </div>
          <p className="text-xs text-gray-500">
            These account details will be shown to students on the payment page.
          </p>
        </CardContent>
      </Card>

      {/* System Toggles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Wrench className="h-5 w-5 text-pild-primary" />
            System Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Maintenance Mode</p>
              <p className="text-xs text-gray-500">Block public access to the site</p>
            </div>
            <button
              onClick={() => toggle("maintenanceMode")}
              className="relative w-14 h-7 rounded-full transition-colors shrink-0"
              style={{ backgroundColor: settings.maintenanceMode === "true" ? "#ef4444" : "#10b981" }}
            >
              <span
                className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform shadow-sm"
                style={{
                  transform: settings.maintenanceMode === "true" ? "translate-x-7" : "translate-x-0",
                }}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Allow New Registrations</p>
              <p className="text-xs text-gray-500">Let new students create accounts</p>
            </div>
            <button
              onClick={() => toggle("allowRegistration")}
              className="relative w-14 h-7 rounded-full transition-colors shrink-0"
              style={{ backgroundColor: settings.allowRegistration === "true" ? "#10b981" : "#ef4444" }}
            >
              <span
                className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform shadow-sm"
                style={{
                  transform: settings.allowRegistration === "true" ? "translate-x-7" : "translate-x-0",
                }}
              />
            </button>
          </div>

          <div className="space-y-1.5">
            <Label>Default Course Fee (PKR)</Label>
            <Input
              type="number"
              value={settings.defaultCourseFee}
              onChange={(e) => update("defaultCourseFee", e.target.value)}
              placeholder="15000"
            />
            <p className="text-xs text-gray-500">
              Suggested default when creating new courses.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save */}
      <Button
        onClick={handleSave}
        disabled={saving}
        className="bg-pild-primary gap-2 w-full sm:w-auto"
      >
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        {saving ? "Saving..." : "Save All Settings"}
      </Button>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            System Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Framework</p>
              <p className="font-medium text-gray-900">Next.js 14.2.35</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Database</p>
              <p className="font-medium text-gray-900">PostgreSQL (NeonDB)</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Auth</p>
              <p className="font-medium text-gray-900">NextAuth.js</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-500">ORM</p>
              <p className="font-medium text-gray-900">Prisma 5.15.0</p>
            </div>
          </div>
          <p className="text-xs text-gray-400">
            PILD Academy LMS — Do not upgrade Next.js or Prisma without testing.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}