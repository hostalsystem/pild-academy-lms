"use client";

import { useState } from "react";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import { Download, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CertificatePDF } from "./certificate-pdf";

interface DownloadButtonProps {
  studentName: string;
  courseName: string;
  certificateNumber: string;
  issuedDate: string;
  duration: string | null;
}

export function CertificateDownloadButton({
  studentName,
  courseName,
  certificateNumber,
  issuedDate,
  duration,
}: DownloadButtonProps) {
  const [generating, setGenerating] = useState(false);

  const handleDownload = async () => {
    setGenerating(true);
    try {
      const blob = await pdf(
        <CertificatePDF
          studentName={studentName}
          courseName={courseName}
          certificateNumber={certificateNumber}
          issuedDate={issuedDate}
          duration={duration}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `PILD-Certificate-${certificateNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={generating}
      className="bg-pild-primary gap-2"
    >
      {generating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {generating ? "Generating..." : "Download PDF"}
    </Button>
  );
}