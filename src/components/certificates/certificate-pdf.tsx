"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 40,
    fontFamily: "Helvetica",
  },
  border: {
    border: "3px solid #1e40af",
    padding: 30,
    height: "100%",
    position: "relative",
  },
  innerBorder: {
    border: "1px solid #f59e0b",
    padding: 20,
    height: "100%",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  academyName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e40af",
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 10,
    color: "#64748b",
    marginTop: 4,
    letterSpacing: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1e40af",
    textAlign: "center",
    marginVertical: 20,
    letterSpacing: 4,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 30,
  },
  presentText: {
    fontSize: 16,
    color: "#334155",
    textAlign: "center",
    marginBottom: 10,
  },
  recipientName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0f172a",
    textAlign: "center",
    marginVertical: 15,
    borderBottom: "2px solid #f59e0b",
    paddingBottom: 10,
  },
  courseText: {
    fontSize: 14,
    color: "#334155",
    textAlign: "center",
    marginBottom: 5,
  },
  courseName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e40af",
    textAlign: "center",
    marginVertical: 10,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
    paddingHorizontal: 20,
  },
  detailBox: {
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 10,
    color: "#64748b",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0f172a",
  },
  seal: {
    position: "absolute",
    bottom: 60,
    right: 60,
    width: 80,
    height: 80,
    borderRadius: 40,
    border: "2px solid #f59e0b",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fef3c7",
  },
  sealText: {
    fontSize: 9,
    color: "#b45309",
    textAlign: "center",
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
  },
  footerText: {
    fontSize: 9,
    color: "#94a3b8",
  },
  signatureLine: {
    borderTop: "1px solid #334155",
    width: 150,
    marginTop: 30,
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 11,
    color: "#334155",
    fontWeight: "bold",
  },
});

interface CertificatePDFProps {
  studentName: string;
  courseName: string;
  certificateNumber: string;
  issuedDate: string;
  duration: string | null;
}

export function CertificatePDF({
  studentName,
  courseName,
  certificateNumber,
  issuedDate,
  duration,
}: CertificatePDFProps) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.border}>
          <View style={styles.innerBorder}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.academyName}>PILD ACADEMY</Text>
              <Text style={styles.tagline}>
                PROFESSIONAL INSTITUTE OF LEARNING & DEVELOPMENT
              </Text>
            </View>

            {/* Title */}
            <Text style={styles.title}>Certificate</Text>
            <Text style={styles.subtitle}>of Completion</Text>

            {/* Body */}
            <Text style={styles.presentText}>This is to certify that</Text>
            <Text style={styles.recipientName}>{studentName}</Text>
            <Text style={styles.courseText}>
              has successfully completed the course
            </Text>
            <Text style={styles.courseName}>{courseName}</Text>
            {duration && (
              <Text style={styles.courseText}>
                with a duration of {duration}
              </Text>
            )}

            {/* Details */}
            <View style={styles.detailsRow}>
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>Certificate No.</Text>
                <Text style={styles.detailValue}>{certificateNumber}</Text>
              </View>

              <View style={styles.detailBox}>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureText}>Director</Text>
                <Text style={styles.detailLabel}>Authorized Signature</Text>
              </View>

              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>Date Issued</Text>
                <Text style={styles.detailValue}>{issuedDate}</Text>
              </View>
            </View>

            {/* Seal */}
            <View style={styles.seal}>
              <Text style={styles.sealText}>PILD</Text>
              <Text style={styles.sealText}>ACADEMY</Text>
              <Text style={styles.sealText}>OFFICIAL</Text>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Verify this certificate at pildacademy.com/verify/{certificateNumber}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}