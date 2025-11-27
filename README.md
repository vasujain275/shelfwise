<div align="center">

# 📚 ShelfWise

### Modern Library Management System

[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.13-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

**A comprehensive, offline-first library management solution built with enterprise-grade security and modern UI/UX**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Documentation](#-documentation) • [Screenshots](#-screenshots)

</div>

---

## 🌟 Overview

ShelfWise is a full-featured, production-ready library management system designed specifically for **offline-first operations**. Built with React and Spring Boot, it provides a seamless experience for managing books, members, and transactions with role-based access control and comprehensive reporting capabilities.

## ✨ Features

### 🔐 **Authentication & Authorization**

- **JWT-based Authentication** with secure HttpOnly cookies
- **Role-Based Access Control** (RBAC) with three distinct roles:
  - 🔵 **MEMBER** - Library members with personal dashboard
  - 🟢 **ADMIN** - Library administrators with management capabilities
  - 🟡 **SUPER_ADMIN** - Full system access with advanced controls
- **Secure Spring Security** implementation with custom filters
- **Refresh Token** mechanism for seamless session management
- **Protected Routes** with role-based navigation

### 📖 **Book Management**

- ➕ **Create, Read, Update, Delete** (CRUD) operations
- 📦 **Bulk Book Upload** via JSON file import
- 🔍 **Advanced Search** with pagination and sorting
- 📊 **Book Status Tracking** (Available, Issued, Damaged, Lost, Under Maintenance)
- 📚 **Multiple Book Types** support (Book, Magazine, Journal, Newspaper, Reference, Thesis, Report, Manuscript)
- 🏷️ **Custom Barcode Generation** for printing barcode sheets
- 📄 **Comprehensive Book Details** including:
  - Accession Number, Title, Author, Publisher
  - ISBN, Edition, Volume, Language
  - Category, Sub-category, Keywords
  - Physical details (Pages, Location, Price)
  - Multiple classification systems support

### 👥 **User Management**

- 👤 **User Profile Management** with detailed information
- 🆔 **Employee ID-based** authentication
- 📱 **Contact Information** (Mobile, Office Phone, Email)
- 🏢 **Organization Details** (Division, Department, Designation, Office Location)
- ✅ **User Status Control** (Active, Inactive, Suspended)
- 🔢 **Borrowing Limit Tracking**
- 📊 **User Activity Reports**

### 🔄 **Transaction Management**

- 📤 **Issue Books** to members with due date tracking
- 📥 **Return Books** with late fee calculation
- 🔁 **Renew Books** for extended borrowing
- ⏰ **Overdue Transaction** alerts and management
- 📜 **Complete Transaction History** per user/book
- 🎟️ **Transaction Receipts** generation for each issue
- 📊 **Active Borrowing Tracking**
- 🔍 **Transaction Search** with advanced filters

### 📊 **Dashboard & Analytics**

#### **Admin Dashboard**
- 📈 Total books, users, and transactions statistics
- 📊 Real-time system metrics
- 🔔 Overdue transaction alerts
- 📉 Borrowing trends and patterns

#### **Member Dashboard**
- 📚 Currently borrowed books
- 📅 Due dates and renewal status
- 📖 Personal borrowing history
- 🎯 Borrowing limits and availability

#### **Super Admin Dashboard**
- 🎛️ Complete system overview
- 👥 User management controls
- 🔧 System configuration access
- 📊 Advanced analytics

### 📑 **Reports & Export**

- 📄 **PDF Report Generation** for:
  - 📚 Books inventory reports
  - 👥 User directory reports
  - 📊 Transaction reports with custom filters
  - 🧾 Book issue receipts
- 📊 **CSV Export** functionality for:
  - Books database
  - Users database
  - Transaction records
- 🖨️ **Printable Barcode Sheets** with customizable layouts:
  - Multiple barcode standards (CODE128, EAN13, CODE39, etc.)
  - Adjustable sheet dimensions for various sticker sizes
  - Batch barcode generation for multiple books

### 🗂️ **Data Management**

- 📥 **CSV Import** for bulk data loading:
  - Books import
  - Users import
  - Transactions import
- 📤 **CSV Export** for data backup and analysis
- 🔄 **Data Validation** during import operations
- 📋 **Import Result Reports** with success/failure details

### 🎨 **User Interface**

- 🌓 **Dark/Light Mode** theme support with CSS variables
- 🎭 **shadcn/ui Components** with customizable theming system
- 📱 **Responsive Design** for all devices
- 🎯 **Modern UI Components** built on Radix UI primitives
- ⚡ **Smooth Animations** with Framer Motion
- 🔍 **Advanced Search & Filters** across all modules
- 📄 **Pagination** for large datasets
- 🔔 **Toast Notifications** for user feedback
- 📊 **Interactive Charts** with Recharts
- 🎨 **Consistent Design System** with Tailwind CSS

### 🔄 **CI/CD Pipeline**

- ✅ **Automated Builds** on every push to main branch
- 🐳 **Multi-Architecture Support** (linux/amd64, linux/arm64)
- 📦 **Automatic Docker Image Publishing** to Docker Hub
- 🏷️ **Version Tagging** from pom.xml
- 💾 **Build Caching** with GitHub Actions
- 🚀 **Zero-Downtime Deployments** with health checks
- 📊 **Resource Limits** configured in Docker Compose
- 🔄 **Auto-restart** on application crashes

---

## 🛠️ Tech Stack

### **Backend**

| Technology | Version | Purpose |
|-----------|---------|---------|
| ☕ **Spring Boot** | 3.3.13 | Core framework |
| 🔒 **Spring Security** | 6.x | Authentication & Authorization |
| 🗄️ **Spring Data JPA** | 3.x | Data persistence |
| 🔐 **JWT (JJWT)** | 0.12.6 | Token-based authentication |
| 🗃️ **MySQL** | 8.x | Database |
| 📝 **Lombok** | Latest | Boilerplate reduction |
| 🗺️ **MapStruct** | 1.5.5 | Object mapping |
| 📄 **Apache Commons CSV** | 1.11.0 | CSV processing |
| 📚 **SpringDoc OpenAPI** | 2.5.0 | API documentation (Swagger) |
| ✅ **Bean Validation** | 3.x | Input validation |

### **Frontend**

| Technology | Version | Purpose |
|-----------|---------|---------|
| ⚛️ **React** | 19.1.0 | UI library |
| 📘 **TypeScript** | 5.8.3 | Type safety |
| 🎨 **Tailwind CSS** | 4.1.10 | Styling framework |
| 🎭 **shadcn/ui** | Latest | Component library with CSS variables theming |
| 🧩 **Radix UI** | Latest | Accessible component primitives |
| 🔄 **TanStack Query** | 5.83.0 | Data fetching & caching |
| 🗂️ **Zustand** | 5.0.5 | State management |
| 🎭 **Framer Motion** | 12.23.0 | Animations |
| 🚀 **React Router** | 7.6.2 | Client-side routing |
| 📄 **React PDF Renderer** | 4.3.0 | PDF generation |
| 🔤 **JSBarcode** | 3.12.1 | Barcode generation |
| 📊 **Recharts** | 3.1.0 | Data visualization |
| 📋 **React Hook Form** | 7.59.0 | Form management |
| ✅ **Zod** | 3.25.71 | Schema validation |
| 🎯 **Lucide React** | Latest | Icon library |
| ⚡ **Vite** | 6.3.5 | Build tool |

### **DevOps & Tools**

- 🐳 **Docker** - Containerization with multi-arch support (amd64/arm64)
- 🔄 **GitHub Actions** - CI/CD pipeline for automated builds
- 🐋 **Docker Hub** - Automated image publishing
- 📦 **Maven** - Backend dependency management
- 📦 **pnpm** - Frontend package manager
- 🔧 **Bruno** - API testing collection
- 📝 **ESLint** - Code linting
- 🎨 **Prettier** - Code formatting

---

## 🚀 Getting Started

### **Prerequisites**

- ☕ **Java 21** or higher
- 📦 **Node.js 18+** and **pnpm**
- 🗄️ **MySQL 8.0+**
- 🐳 **Docker** (optional, for containerized deployment)

### **Installation**

#### **1. Clone the Repository**

```bash
git clone https://github.com/vasujain275/shelfwise.git
cd shelfwise
```

#### **2. Database Setup**

Create a MySQL database:

```sql
CREATE DATABASE shelfwise CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### **3. Backend Configuration**

Navigate to the API directory and configure application properties:

```bash
cd api
cp ../application.yaml.example src/main/resources/application.yaml
```

Edit `src/main/resources/application.yaml` with your database credentials and JWT settings:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/shelfwise
    username: your_username
    password: your_password

jwt:
  secret: your_jwt_secret_key_here
  access-token:
    expiration: 3600
  refresh-token:
    expiration: 604800
```

#### **4. Build and Run Backend**

```bash
# Using Maven wrapper
./mvnw clean install
./mvnw spring-boot:run

# Or using Maven
mvn clean install
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`

#### **5. Frontend Setup**

```bash
cd ../web
pnpm install
pnpm dev
```

The web application will be available at `http://localhost:5173`

### **Development Mode**

For development with auto-restart on backend changes:

```bash
# Build frontend, backend, and run with auto-restart
./dev.sh
```

This script will:
1. Build the React frontend with Vite
2. Copy frontend build to Spring Boot static resources
3. Build the backend JAR
4. Run the application with auto-restart on crashes

### **Production Build**

For production deployment without Docker:

```bash
# Build and run production-ready application
./run.sh
```

### **🐳 Docker Deployment**

#### **Using Pre-built Image**

Pull and run the latest image from Docker Hub:

```bash
# Pull the latest image
docker pull vasujain275/shelfwise:latest

# Run with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

#### **Building Custom Image**

Build your own Docker image:

```bash
# Build multi-architecture image
docker buildx build --platform linux/amd64,linux/arm64 -t shelfwise:custom .

# Run the custom image
docker run -d -p 9080:9080 \
  -v ./application.yaml:/app/config/application.yaml:ro \
  -v app_logs:/app/logs \
  -v app_uploads:/app/uploads \
  shelfwise:custom
```

**Note**: The application runs on port **9080** by default. Update `application.yaml` to configure:
- Database connection
- JWT secrets
- Cookie domain settings
- File upload paths

Refer to [DOCKER.md](DOCKER.md) for detailed Docker deployment instructions.

---

## 📖 Documentation

### **API Documentation**

Once the backend is running, access the interactive API documentation:

- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI Spec**: `http://localhost:8080/v3/api-docs`

### **API Collections**

The project includes a complete Bruno API collection for testing:

```bash
cd api/bruno-collection
```

Import this collection into Bruno to test all API endpoints.

### **Available Endpoints**

#### **Authentication**
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/status` - Check authentication status
- `POST /api/auth/logout` - User logout

#### **Books**
- `GET /api/books` - List all books (paginated)
- `GET /api/books/{id}` - Get book by ID
- `POST /api/books` - Create new book (Admin/Super Admin)
- `POST /api/books/bulk` - Bulk upload books (Admin/Super Admin)
- `PUT /api/books/{id}` - Update book (Admin/Super Admin)
- `DELETE /api/books/{id}` - Delete book (Admin/Super Admin)
- `GET /api/books/search` - Search books

#### **Users**
- `GET /api/users` - List all users (Admin/Super Admin)
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create new user (Admin/Super Admin)
- `PUT /api/users/{id}` - Update user (Admin/Super Admin)
- `DELETE /api/users/{id}` - Delete user (Super Admin)
- `GET /api/users/search` - Search users

#### **Transactions**
- `POST /api/transactions/issue` - Issue book (Admin/Super Admin)
- `POST /api/transactions/return` - Return book (Admin/Super Admin)
- `POST /api/transactions/renew` - Renew book (Admin/Super Admin)
- `GET /api/transactions` - List all transactions
- `GET /api/transactions/{id}` - Get transaction by ID
- `GET /api/transactions/active` - Get active transactions
- `GET /api/transactions/overdue` - Get overdue transactions
- `GET /api/transactions/user/{userId}` - Get user's transactions
- `GET /api/transactions/book/{bookId}` - Get book's transaction history

#### **Dashboard**
- `GET /api/dashboard/admin` - Admin dashboard statistics
- `GET /api/dashboard/member` - Member dashboard statistics
- `POST /api/dashboard/refresh` - Refresh dashboard cache

#### **Data Management**
- `POST /api/import/books` - Import books from CSV
- `POST /api/import/users` - Import users from CSV
- `POST /api/import/transactions` - Import transactions from CSV
- `GET /api/export/books` - Export books to CSV
- `GET /api/export/users` - Export users to CSV
- `GET /api/export/transactions` - Export transactions to CSV

---

## 🎯 Key Features Explained

### **Secure Authentication Flow**

1. User logs in with Employee ID and password
2. Server validates credentials and generates JWT tokens
3. Access token and refresh token stored in **HttpOnly cookies**
4. All subsequent requests include cookies automatically
5. Access token expires after 1 hour, refresh token after 7 days
6. Client automatically refreshes tokens when needed
7. Secure logout clears all cookies and invalidates tokens

### **Barcode Sheet Generation**

The system provides a sophisticated barcode generation feature:

1. **Search and Select Books**: Find books using the search interface
2. **Choose Barcode Standard**: Support for 18+ barcode formats
3. **Customize Layout**: Adjust rows, columns, margins, and spacing
4. **Preview and Generate**: Create printable PDF sheets
5. **Multiple Standards**: CODE128, EAN13, CODE39, UPC, and more

### **Transaction Workflow**

1. **Issue Book**:
   - Admin searches for available book
   - Selects member
   - Sets due date
   - System generates receipt PDF
   - Updates book status and member's borrowed count

2. **Return Book**:
   - Admin scans/searches for transaction
   - Confirms return
   - System calculates any late fees
   - Updates book availability
   - Records return date

3. **Renew Book**:
   - Member requests renewal
   - Admin approves (if no overdue)
   - System extends due date
   - Sends notification

### **Report Generation**

- **Book Reports**: Comprehensive inventory with filters
- **User Reports**: Member directory with contact details
- **Transaction Reports**: Borrowing history with date ranges
- **Custom PDFs**: Professional layouts with logos and headers
- **Print-Ready**: Optimized for A4 paper size

---

## 📁 Project Structure

```
shelfwise/
├── api/                          # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── in/dipr/library/
│   │   │   │       ├── controllers/    # REST Controllers
│   │   │   │       ├── services/       # Business Logic
│   │   │   │       ├── repositories/   # Data Access
│   │   │   │       ├── models/         # JPA Entities
│   │   │   │       ├── dtos/           # Data Transfer Objects
│   │   │   │       ├── enums/          # Enumerations
│   │   │   │       ├── mapper/         # MapStruct Mappers
│   │   │   │       ├── exceptions/     # Custom Exceptions
│   │   │   │       ├── response/       # Response Utilities
│   │   │   │       └── config/         # Configuration Classes
│   │   │   └── resources/
│   │   │       └── application.yaml    # Application Config
│   │   └── test/                       # Unit Tests
│   ├── bruno-collection/               # API Test Collection
│   └── pom.xml                         # Maven Configuration
│
├── web/                          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/              # Authentication Components
│   │   │   ├── dashboard/         # Dashboard Components
│   │   │   ├── layout/            # Layout Components
│   │   │   ├── modals/            # Modal Dialogs
│   │   │   ├── pages/             # Page Components
│   │   │   ├── pdf/               # PDF Generation Components
│   │   │   ├── shared-pages/      # Shared Page Components
│   │   │   └── ui/                # UI Components (Radix + Tailwind)
│   │   ├── lib/                   # Utility Functions
│   │   ├── pages/                 # Route Pages
│   │   ├── store/                 # Zustand State Management
│   │   ├── types/                 # TypeScript Type Definitions
│   │   ├── App.tsx                # Main App Component
│   │   └── main.tsx               # Entry Point
│   ├── public/                    # Static Assets
│   ├── package.json               # Node Dependencies
│   └── vite.config.ts             # Vite Configuration
│
├── docker-compose.prod.yml       # Production Docker Config
├── Dockerfile                    # Docker Build Instructions
├── DOCKER.md                     # Docker Documentation
└── README.md                     # This File
```

---

## 🎨 Screenshots

### **Dashboard Views**

<div align="center">
<table>
  <tr>
    <td align="center"><b>📊 Admin Dashboard</b><br/>System-wide statistics and metrics</td>
    <td align="center"><b>📚 Member Dashboard</b><br/>Personal borrowing overview</td>
  </tr>
</table>
</div>

### **Book Management**

<div align="center">
<table>
  <tr>
    <td align="center"><b>📖 Book Catalog</b><br/>Browse and search books</td>
    <td align="center"><b>🏷️ Barcode Generation</b><br/>Custom barcode sheets</td>
  </tr>
</table>
</div>

### **Transaction Management**

<div align="center">
<table>
  <tr>
    <td align="center"><b>📤 Issue Book</b><br/>Book issuing interface</td>
    <td align="center"><b>🧾 Transaction Receipt</b><br/>Printable receipt</td>
  </tr>
</table>
</div>

---

## 🔒 Security Features

- ✅ **JWT Authentication** with access and refresh tokens
- ✅ **HttpOnly Cookies** to prevent XSS attacks
- ✅ **Secure Cookie Flags** (Secure, SameSite)
- ✅ **Spring Security** with role-based method security
- ✅ **Password Encryption** using BCrypt
- ✅ **CORS Configuration** for cross-origin requests
- ✅ **Input Validation** on both frontend and backend
- ✅ **SQL Injection Prevention** through JPA
- ✅ **XSS Protection** through React's default escaping
- ✅ **CSRF Protection** through token validation

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Vasu Jain**

- GitHub: [@vasujain275](https://github.com/vasujain275)
- LinkedIn: [Vasu Jain](https://linkedin.com/in/vasujain275)

---

## 🙏 Acknowledgments

- Spring Boot Team for the excellent framework
- React Team for the powerful UI library
- Radix UI for accessible component primitives
- Tailwind CSS for the utility-first CSS framework
- All open-source contributors whose libraries made this project possible

---

## 📞 Support

For support, email vasujain275@gmail.com or open an issue in the repository.

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ for library management

</div>
