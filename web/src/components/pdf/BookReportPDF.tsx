import type { Book } from "@/types/book";
import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import React from "react";

Font.register({
  family: "Noto Sans",
  fonts: [
    { src: "/fonts/NotoSans-Regular.ttf", fontWeight: "normal" },
    { src: "/fonts/NotoSans-Bold.ttf", fontWeight: "bold" },
  ],
});

Font.register({
  family: "Noto Sans Devanagari",
  src: "/fonts/NotoSansDevanagari.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 10,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    borderBottom: "2 solid #000",
    paddingBottom: 10,
  },
  logo: { width: 60, height: 60, marginBottom: 10 },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
  },
  section: { marginTop: 10, marginBottom: 10 },
  // @ts-expect-error - display is a valid style property for react-pdf but not for react-native
  table: { display: "table", width: "auto", marginTop: 10 },
  tableRow: { flexDirection: "row" },
  tableHeader: { backgroundColor: "#f0f0f0", fontWeight: "bold" },
  cell: { flex: 1, padding: 4, border: "1 solid #ccc", fontSize: 9 },
});

const columns = [
  { label: "Employee No", key: "employeeId" },
  { label: "User Name", key: "userFullName" },
  { label: "Type", key: "transactionType" },
  { label: "Status", key: "status" },
  { label: "Issue Date", key: "issueDate" },
  { label: "Due Date", key: "dueDate" },
  { label: "Return Date", key: "returnDate" },
];

interface Transaction {
  id: string;
  bookId: string;
  bookTitle: string;
  userId: string;
  userFullName: string;
  employeeId?: string;
  transactionType: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string | null;
  renewalCount: number;
  issuedByUserId: string;
  issuedByUserFullName: string;
  returnedToUserId?: string | null;
  returnedToUserFullName?: string | null;
  status: string;
  transactionNotes?: string | null;
}

interface BookReportPDFProps {
  book: Book;
  data: Transaction[];
  language?: string;
}

const ROWS_PER_PAGE = 28;

const BookReportPDF: React.FC<BookReportPDFProps> = ({
  book,
  data = [],
  language,
}) => {
  const titleFont =
    language && language.toLowerCase() === "hindi"
      ? "Noto Sans Devanagari"
      : "Noto Sans";

  // Handle no data case
  if (!data || data.length === 0) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Image src="/shelfwise.png" style={styles.logo} />
            <Text style={styles.title}>ShelfWise</Text>
            <Text style={styles.subtitle}>Library Management System</Text>
            <Text style={{ fontSize: 14, fontWeight: "bold", marginTop: 10 }}>
              Book Transaction History Report
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={{ fontSize: 11, fontWeight: "bold" }}>
              Book Details
            </Text>
            <Text style={{ fontFamily: titleFont }}>Title: {book.title}</Text>
            <Text>Accession No: {book.accessionNumber}</Text>
            <Text>Author: {book.authorPrimary}</Text>
            <Text>ISBN: {book.isbn}</Text>
            <Text>Publisher: {book.publisher}</Text>
            <Text>Report Generated: {new Date().toLocaleString()}</Text>
          </View>
          <View style={{ marginTop: 40, textAlign: "center" }}>
            <Text style={{ fontSize: 12, color: "#666" }}>
              No transaction history found for this book.
            </Text>
          </View>
          <Text
            style={{
              position: "absolute",
              bottom: 30,
              left: 0,
              right: 0,
              textAlign: "center",
              fontSize: 8,
              color: "#888",
            }}
          >
            © {new Date().getFullYear()} ShelfWise. All rights reserved.
          </Text>
        </Page>
      </Document>
    );
  }

  // Split data into pages for rendering
  const pages = [];
  for (let i = 0; i < data.length; i += ROWS_PER_PAGE) {
    pages.push(data.slice(i, i + ROWS_PER_PAGE));
  }

  return (
    <Document>
      {pages.map((pageRows, pageIndex) => (
        <Page size="A4" style={styles.page} key={pageIndex} wrap>
          <View style={styles.header} fixed>
            <Image src="/shelfwise.png" style={styles.logo} />
            <Text style={styles.title}>ShelfWise</Text>
            <Text style={styles.subtitle}>Library Management System</Text>
            <Text style={{ fontSize: 14, fontWeight: "bold", marginTop: 10 }}>
              Book Transaction History Report
            </Text>
          </View>
          <View style={styles.section} fixed>
            <Text style={{ fontSize: 11, fontWeight: "bold" }}>
              Book Details
            </Text>
            <Text style={{ fontFamily: titleFont }}>Title: {book.title}</Text>
            <Text>Accession No: {book.accessionNumber}</Text>
            <Text style={{ fontFamily: titleFont }}>
              Author: {book.authorPrimary}
            </Text>
            <Text>ISBN: {book.isbn}</Text>
            <Text style={{ fontFamily: titleFont }}>
              Publisher: {book.publisher}
            </Text>
            <Text>Report Generated: {new Date().toLocaleString()}</Text>
          </View>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]} fixed>
              {columns.map((col) => (
                <Text key={col.key} style={styles.cell}>
                  {col.label}
                </Text>
              ))}
            </View>
            {pageRows.map((row: Transaction, idx) => (
              <View key={row.id || idx} style={styles.tableRow}>
                {columns.map((col) => (
                  <Text key={col.key} style={styles.cell}>
                    {(row as unknown as { [key: string]: string })[col.key] ||
                      "-"}
                  </Text>
                ))}
              </View>
            ))}
          </View>
          <Text
            style={{
              marginTop: 20,
              fontSize: 8,
              color: "#888",
              textAlign: "center",
            }}
            fixed
          >
            Page {pageIndex + 1} of {pages.length}
          </Text>
          <Text
            style={{
              marginTop: 2,
              fontSize: 8,
              color: "#888",
              textAlign: "center",
            }}
            fixed
          >
            © {new Date().getFullYear()} ShelfWise. All rights reserved.
          </Text>
        </Page>
      ))}
    </Document>
  );
};

export default BookReportPDF;
