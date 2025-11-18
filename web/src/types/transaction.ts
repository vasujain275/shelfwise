
export type TransactionType = 'ISSUE' | 'RETURN' | 'RENEW' | 'LOST_REPORT' | 'DAMAGE_REPORT';
export type TransactionStatus = 'ACTIVE' | 'COMPLETED' | 'OVERDUE' | 'LOST' | 'DAMAGED';

export interface Transaction {
  id: string;
  bookId: string;
  bookTitle: string;
  userId: string;
  userFullName: string;
  transactionType: TransactionType;
  issueDate: string;
  dueDate: string;
  returnDate?: string | null;
  renewalCount: number;
  issuedByUserId: string;
  issuedByUserFullName: string;
  returnedToUserId?: string | null;
  returnedToUserFullName?: string | null;
  status: TransactionStatus;
  transactionNotes?: string | null;
}

export interface TransactionResponse {
  status: string;
  message: string | null;
  data: Transaction | Transaction[];
  timestamp: string;
  pagination?: {
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}
