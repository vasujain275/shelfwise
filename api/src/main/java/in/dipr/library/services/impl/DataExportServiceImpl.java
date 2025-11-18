package in.dipr.library.services.impl;

import in.dipr.library.models.Book;
import in.dipr.library.models.User;
import in.dipr.library.models.BookTransaction;
import in.dipr.library.repositories.BookRepository;
import in.dipr.library.repositories.UserRepository;
import in.dipr.library.repositories.BookTransactionRepository;
import in.dipr.library.services.DataExportService;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileWriter;
import java.util.List;

@Service
public class DataExportServiceImpl implements DataExportService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookTransactionRepository bookTransactionRepository;

    private final String TEMP_CSV_PATH = "temp_csvs/";

    private void ensureDirectoryExists() {
        File directory = new File(TEMP_CSV_PATH);
        if (!directory.exists()) {
            directory.mkdirs();
        }
    }

    @Override
    public File exportBooksToCsv() throws Exception {
        ensureDirectoryExists();
        List<Book> books = bookRepository.findAll();
        File csvFile = new File(TEMP_CSV_PATH + "books_export.csv");
        try (FileWriter out = new FileWriter(csvFile);
             CSVPrinter printer = new CSVPrinter(out, CSVFormat.DEFAULT.withHeader("id", "accessionNumber", "isbn", "title", "subtitle", "authorPrimary", "authorSecondary", "publisher", "publicationPlace", "publicationYear", "edition", "pages", "language", "price", "billNumber", "vendorName", "purchaseDate", "keywords", "classificationNumber", "locationShelf", "locationRack", "bookCondition", "bookStatus", "totalCopies", "availableCopies", "bookType", "isReferenceOnly", "registrationDate", "notes")))
        {
            for (Book book : books) {
                printer.printRecord(book.getId(), book.getAccessionNumber(), book.getIsbn(), book.getTitle(), book.getSubtitle(), book.getAuthorPrimary(), book.getAuthorSecondary(), book.getPublisher(), book.getPublicationPlace(), book.getPublicationYear(), book.getEdition(), book.getPages(), book.getLanguage(), book.getPrice(), book.getBillNumber(), book.getVendorName(), book.getPurchaseDate(), book.getKeywords(), book.getClassificationNumber(), book.getLocationShelf(), book.getLocationRack(), book.getBookCondition(), book.getBookStatus(), book.getTotalCopies(), book.getAvailableCopies(), book.getBookType(), book.getIsReferenceOnly(), book.getRegistrationDate(), book.getNotes());
            }
        }
        return csvFile;
    }

    @Override
    public File exportUsersToCsv() throws Exception {
        ensureDirectoryExists();
        List<User> users = userRepository.findAll();
        File csvFile = new File(TEMP_CSV_PATH + "users_export.csv");
        try (FileWriter out = new FileWriter(csvFile);
             CSVPrinter printer = new CSVPrinter(out, CSVFormat.DEFAULT.withHeader("id", "employeeId", "fullName", "email", "phoneMobile", "phoneOffice", "division", "department", "designation", "floorNumber", "officeRoom", "address", "userRole", "userStatus", "booksIssued", "registrationDate", "expirationDate", "photoPath", "emergencyContact", "emergencyPhone", "remarks", "password")))
        {
            for (User user : users) {
                printer.printRecord(user.getId(), user.getEmployeeId(), user.getFullName(), user.getEmail(), user.getPhoneMobile(), user.getPhoneOffice(), user.getDivision(), user.getDepartment(), user.getDesignation(), user.getFloorNumber(), user.getOfficeRoom(), user.getAddress(), user.getUserRole(), user.getUserStatus(), user.getBooksIssued(), user.getRegistrationDate(), user.getExpirationDate(), user.getPhotoPath(), user.getEmergencyContact(), user.getEmergencyPhone(), user.getRemarks(), user.getPassword());
            }
        }
        return csvFile;
    }

    @Override
    public File exportTransactionsToCsv() throws Exception {
        ensureDirectoryExists();
        List<BookTransaction> transactions = bookTransactionRepository.findAll();
        File csvFile = new File(TEMP_CSV_PATH + "transactions_export.csv");
        try (FileWriter out = new FileWriter(csvFile);
             CSVPrinter printer = new CSVPrinter(out, CSVFormat.DEFAULT.withHeader("id", "bookAccessionNumber", "userEmployeeId", "transactionType", "status", "issueDate", "dueDate", "returnDate", "transactionNotes", "issuedByEmployeeId", "returnedToEmployeeId")))
        {
            for (BookTransaction transaction : transactions) {
                printer.printRecord(transaction.getId(), 
                                    transaction.getBook().getAccessionNumber(), 
                                    transaction.getUser().getEmployeeId(), 
                                    transaction.getTransactionType(), 
                                    transaction.getStatus(), 
                                    transaction.getIssueDate().toLocalDate(), 
                                    transaction.getDueDate().toLocalDate(), 
                                    transaction.getReturnDate() != null ? transaction.getReturnDate().toLocalDate() : null, 
                                    transaction.getTransactionNotes(),
                                    transaction.getIssuedBy() != null ? transaction.getIssuedBy().getEmployeeId() : "",
                                    transaction.getReturnedTo() != null ? transaction.getReturnedTo().getEmployeeId() : "");
            }
        }
        return csvFile;
    }
}