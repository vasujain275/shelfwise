import {
  Home,
  Search,
  Book,
  History,
  User,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  BookPlus,
  Users,
  Settings,
  UserCog,
  FileText,
  UploadCloud,
} from "lucide-react";

interface SidebarLink {
  label: string;
  href?: string;
  icon?: React.ElementType;
  isHeader?: boolean;
  children?: SidebarLink[];
}

export const memberLinks: SidebarLink[] = [
  { label: "Dashboard", href: "/dashboard/member", icon: Home },
  { label: "Search Books", href: "/dashboard/member/search-books", icon: Search },
  { label: "My Books", href: "/dashboard/member/my-books", icon: Book },
  { label: "Profile", href: "/dashboard/member/profile", icon: User },
];

export const adminLinks: SidebarLink[] = [
  { label: "Dashboard", href: "/dashboard/admin", icon: Home },
  {
    label: "Transactions",
    icon: ArrowUpRight,
    children: [
      { label: "Issue Book", href: "/dashboard/admin/issue-book", icon: ArrowUpRight },
      { label: "Return Book", href: "/dashboard/admin/return-book", icon: ArrowDownLeft },
      { label: "Renew Book", href: "/dashboard/admin/renew-book", icon: RefreshCw },
      { label: "All Transactions", href: "/dashboard/admin/transactions", icon: History },
    ],
  },
  {
    label: "Books",
    icon: Book,
    children: [
      { label: "Search Books", href: "/dashboard/admin/search-books", icon: Search },
      { label: "Add Book", href: "/dashboard/admin/add-book", icon: BookPlus },
      { label: "Manage Books", href: "/dashboard/admin/manage-books", icon: Book },
      { label: "Generate Barcodes", href: "/dashboard/admin/generate-barcodes", icon: FileText },
    ],
  },
  {
    label: "Users",
    icon: Users,
    children: [
      { label: "Add User", href: "/dashboard/admin/add-user", icon: Users },
      { label: "Manage Users", href: "/dashboard/admin/manage-users", icon: UserCog },
    ],
  },
  {
    label: "System",
    icon: Settings,
    children: [
      { label: "Data Import", href: "/dashboard/admin/data-import", icon: UploadCloud },
      { label: "Data Export", href: "/dashboard/admin/data-export", icon: FileText },
      {
        label: "Reports",
        icon: FileText,
        children: [
          { label: "Issued Books", href: "/dashboard/admin/reports/issued-books", icon: FileText },
          { label: "User Reports", href: "/dashboard/admin/reports/user-reports", icon: FileText },
          { label: "Book Reports", href: "/dashboard/admin/reports/book-reports", icon: FileText },
        ],
      },
    ],
  },
  { label: "Profile", href: "/dashboard/admin/profile", icon: User },
];

export const superAdminLinks: SidebarLink[] = [
  { label: "Dashboard", href: "/dashboard/super-admin", icon: Home },
  {
    label: "Transactions",
    icon: ArrowUpRight,
    children: [
      { label: "Issue Book", href: "/dashboard/super-admin/issue-book", icon: ArrowUpRight },
      { label: "Return Book", href: "/dashboard/super-admin/return-book", icon: ArrowDownLeft },
      { label: "Renew Book", href: "/dashboard/super-admin/renew-book", icon: RefreshCw },
      { label: "All Transactions", href: "/dashboard/super-admin/transactions", icon: History },
    ],
  },
  {
    label: "Books",
    icon: Book,
    children: [
      { label: "Search Books", href: "/dashboard/super-admin/search-books", icon: Search },
      { label: "Add Book", href: "/dashboard/super-admin/add-book", icon: BookPlus },
      { label: "Bulk Book Upload", href: "/dashboard/super-admin/bulk-upload", icon: FileText },
      { label: "Manage Books", href: "/dashboard/super-admin/manage-books", icon: Book },
      { label: "Generate Barcodes", href: "/dashboard/super-admin/generate-barcodes", icon: FileText },
    ],
  },
  {
    label: "Users",
    icon: Users,
    children: [
      { label: "Add User", href: "/dashboard/super-admin/add-user", icon: Users },
      { label: "Manage Users", href: "/dashboard/super-admin/manage-users", icon: UserCog },
    ],
  },
  {
    label: "System",
    icon: Settings,
    children: [
      { label: "Data Import", href: "/dashboard/super-admin/data-import", icon: UploadCloud },
      { label: "Data Export", href: "/dashboard/super-admin/data-export", icon: FileText },
      {
        label: "Reports",
        icon: FileText,
        children: [
          { label: "Issued Books", href: "/dashboard/super-admin/reports/issued-books", icon: FileText },
          { label: "User Reports", href: "/dashboard/super-admin/reports/user-reports", icon: FileText },
          { label: "Book Reports", href: "/dashboard/super-admin/reports/book-reports", icon: FileText },
        ],
      },
    ],
  },
  { label: "Profile", href: "/dashboard/super-admin/profile", icon: User },
];
