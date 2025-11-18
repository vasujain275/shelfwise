import { useAuthStore } from "@/store/authStore";
import type { UserProfile } from "@/types/auth";
import type { Book } from "@/types/book";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import React from "react";

// Create styles optimized for A4
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 10,
  },
  header: {
    alignItems: "center",
    marginBottom: 25,
    borderBottom: "2 solid #000000",
    paddingBottom: 15,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  organizationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 3,
    textAlign: "center",
  },
  organizationSubtitle: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 8,
    textAlign: "center",
  },
  receiptTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000000",
    marginVertical: 15,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
    borderBottom: "1 solid #cccccc",
    paddingBottom: 3,
  },
  infoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 20,
  },
  infoColumn: {
    flex: 1,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    fontSize: 9,
  },
  label: {
    fontWeight: "bold",
    color: "#666666",
    flex: 1,
  },
  value: {
    color: "#000000",
    flex: 2,
    textAlign: "right",
  },
  transactionSection: {
    backgroundColor: "#f8f8f8",
    padding: 12,
    marginBottom: 20,
    border: "1 solid #cccccc",
  },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: 20,
    gap: 40,
  },
  signatureBox: {
    flex: 1,
    alignItems: "center",
  },
  signatureLine: {
    borderTop: "1 solid #000000",
    width: "100%",
    marginTop: 25,
    marginBottom: 8,
  },
  signatureText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 3,
    textAlign: "center",
  },
  signatureName: {
    fontSize: 8,
    color: "#666666",
    marginBottom: 3,
    textAlign: "center",
  },
  signatureDate: {
    fontSize: 7,
    color: "#666666",
    textAlign: "center",
  },
  footer: {
    marginTop: 25,
    paddingTop: 15,
    borderTop: "1 solid #cccccc",
    alignItems: "center",
  },
  footerText: {
    fontSize: 7,
    color: "#666666",
    textAlign: "center",
    lineHeight: 1.3,
    marginTop: 15,
  },
  importantNotes: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    marginTop: 12,
    border: "1 solid #cccccc",
  },
  notesTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 4,
  },
  noteItem: {
    fontSize: 7,
    color: "#000000",
    marginBottom: 2,
  },
});

interface BookIssueReceiptProps {
  book: Book;
  user: UserProfile;
  dueDate: Date;
  issuedBy?: string;
  transactionId: string;
  issueDate: Date;
  language: string;
}

const BookIssueReceipt: React.FC<BookIssueReceiptProps> = ({
  book,
  user,
  dueDate,
  issuedBy,
  transactionId,
  issueDate,
  language,
}) => {
  const { user: adminUser } = useAuthStore();
  const currentYear = new Date().getFullYear();
  const titleFont =
    language && language.toLowerCase() === "hindi"
      ? "Noto Sans Devanagari"
      : "Noto Sans";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image src="/shelfwise.png" style={styles.logo} />
          </View>
          <Text style={styles.organizationTitle}>ShelfWise</Text>
          <Text style={styles.organizationSubtitle}>
            Library Management System
          </Text>
        </View>

        {/* Receipt Title */}
        <Text style={styles.receiptTitle}>Book Issue Receipt</Text>

        {/* Book and User Information */}
        <View style={styles.infoGrid}>
          {/* Book Details */}
          <View style={styles.infoColumn}>
            <Text style={styles.sectionTitle}>Book Details</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Title:</Text>
              <Text
                style={{
                  ...styles.value,
                  fontFamily: titleFont,
                  fontWeight: "bold",
                }}
              >
                {book.title}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Author:</Text>
              <Text style={{ ...styles.value, fontFamily: titleFont }}>
                {book.authorPrimary}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>ISBN:</Text>
              <Text style={styles.value}>{book.isbn || "N/A"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Accession No:</Text>
              <Text style={styles.value}>{book.accessionNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Publisher:</Text>
              <Text style={{ ...styles.value, fontFamily: titleFont }}>
                {book.publisher}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Edition:</Text>
              <Text style={{ ...styles.value, fontFamily: titleFont }}>
                {book.edition}
              </Text>
            </View>
          </View>

          {/* User Details */}
          <View style={styles.infoColumn}>
            <Text style={styles.sectionTitle}>User Details</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{user.fullName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{user.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Employee ID:</Text>
              <Text style={styles.value}>{user.employeeId}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Department:</Text>
              <Text style={styles.value}>{user.department || "N/A"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Division:</Text>
              <Text style={styles.value}>{user.division || "N/A"}</Text>
            </View>
          </View>
        </View>

        {/* Transaction Details */}
        <View style={styles.transactionSection}>
          <Text style={styles.sectionTitle}>Transaction Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Issue Date:</Text>
            <Text style={styles.value}>{format(issueDate, "PPP")}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Due Date:</Text>
            <Text style={styles.value}>{format(dueDate, "PPP")}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Transaction ID:</Text>
            <Text style={styles.value}>{transactionId}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Issued By:</Text>
            <Text style={styles.value}>
              {issuedBy || adminUser?.fullName || "Library Admin"}
            </Text>
          </View>
        </View>

        {/* Signatures */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>Signature</Text>
            <Text style={styles.signatureName}>{user.fullName}</Text>
            <Text style={styles.signatureDate}>
              Date: {format(issueDate, "dd/MM/yyyy")}
            </Text>
          </View>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>Signature</Text>
            <Text style={styles.signatureName}>
              {issuedBy || adminUser?.fullName || "Library Admin"}
            </Text>
            <Text style={styles.signatureDate}>
              Date: {format(issueDate, "dd/MM/yyyy")}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.importantNotes}>
            <Text style={styles.notesTitle}>Important Notes:</Text>
            <Text style={styles.noteItem}>
              • Please return the book on or before the due date
            </Text>
            <Text style={styles.noteItem}>
              • Keep this receipt safe for return verification
            </Text>
            <Text style={styles.noteItem}>
              • For any queries, contact the library staff
            </Text>
            <Text style={styles.noteItem}>
              • Late returns may result in penalties
            </Text>
          </View>
          <Text style={styles.footerText}>
            © {currentYear} ShelfWise. All rights reserved.{"\n"}
            Library Management System
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default BookIssueReceipt;
