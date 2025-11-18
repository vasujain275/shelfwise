package in.dipr.library.services.impl;

import in.dipr.library.dtos.BookIssueDTO;
import in.dipr.library.dtos.DataImportResultDTO;
import in.dipr.library.enums.*;
import in.dipr.library.models.Book;
import in.dipr.library.models.BookTransaction;
import in.dipr.library.models.User;
import in.dipr.library.repositories.BookRepository;
import in.dipr.library.repositories.BookTransactionRepository;
import in.dipr.library.repositories.UserRepository;
import in.dipr.library.services.BookTransactionService;
import in.dipr.library.services.DataImportService;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static in.dipr.library.util.CsvUtils.*;

@Service
public class DataImportServiceImpl implements DataImportService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private BookTransactionService bookTransactionService;

    @Autowired
    private BookTransactionRepository bookTransactionRepository;

    @Override
    public DataImportResultDTO importBooksFromCsv(MultipartFile file) throws Exception {
        int successCount = 0;
        List<String> failedIdentifiers = new ArrayList<>();
        try (Reader reader = new InputStreamReader(file.getInputStream());
             CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader().withIgnoreHeaderCase().withTrim())) {
            for (CSVRecord csvRecord : csvParser) {
                String accessionNumber = getString(csvRecord, "accessionNumber");
                if (accessionNumber == null || bookRepository.findByAccessionNumber(accessionNumber).isPresent()) {
                    failedIdentifiers.add(accessionNumber != null ? accessionNumber : "MISSING_ACCESSION_NUMBER");
                    continue;
                }
                try {
                    Book book = new Book();
                    book.setAccessionNumber(accessionNumber);
                    book.setIsbn(getString(csvRecord, "isbn"));
                    book.setTitle(getString(csvRecord, "title"));
                    book.setSubtitle(getString(csvRecord, "subtitle"));
                    book.setAuthorPrimary(getString(csvRecord, "authorPrimary"));
                    book.setAuthorSecondary(getString(csvRecord, "authorSecondary"));
                    book.setPublisher(getString(csvRecord, "publisher"));
                    book.setPublicationPlace(getString(csvRecord, "publicationPlace"));
                    book.setPublicationYear(getInteger(csvRecord, "publicationYear"));
                    book.setEdition(getString(csvRecord, "edition"));
                    book.setPages(getString(csvRecord, "pages"));
                    book.setLanguage(getString(csvRecord, "language"));
                    book.setPrice(getBigDecimal(csvRecord, "price"));
                    book.setBillNumber(getString(csvRecord, "billNumber"));
                    book.setVendorName(getString(csvRecord, "vendorName"));
                    book.setPurchaseDate(getLocalDate(csvRecord, "purchaseDate"));
                    book.setKeywords(getString(csvRecord, "keywords"));
                    book.setClassificationNumber(getString(csvRecord, "classificationNumber"));
                    book.setLocationShelf(getString(csvRecord, "locationShelf"));
                    book.setLocationRack(getString(csvRecord, "locationRack"));
                    book.setBookCondition(getEnum(csvRecord, "bookCondition", BookCondition.class));
                    book.setBookStatus(getEnum(csvRecord, "bookStatus", BookStatus.class));
                    book.setTotalCopies(getInteger(csvRecord, "totalCopies"));
                    book.setAvailableCopies(getInteger(csvRecord, "availableCopies"));
                    book.setBookType(getEnum(csvRecord, "bookType", BookType.class));
                    book.setIsReferenceOnly(getBoolean(csvRecord, "isReferenceOnly"));
                    book.setRegistrationDate(getLocalDateTime(csvRecord, "registrationDate"));
                    book.setNotes(getString(csvRecord, "notes"));
                    bookRepository.save(book);
                    successCount++;
                } catch (Exception e) {
                    failedIdentifiers.add(accessionNumber);
                }
            }
        }
        return new DataImportResultDTO(successCount, failedIdentifiers.size(), failedIdentifiers, "Book import process completed.");
    }

    @Override
    public DataImportResultDTO importUsersFromCsv(MultipartFile file) throws Exception {
        int successCount = 0;
        List<String> failedIdentifiers = new ArrayList<>();
        try (Reader reader = new InputStreamReader(file.getInputStream());
             CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader().withIgnoreHeaderCase().withTrim())) {
            for (CSVRecord csvRecord : csvParser) {
                String employeeId = getString(csvRecord, "employeeId");
                if (employeeId == null || userRepository.findByEmployeeId(employeeId).isPresent()) {
                    failedIdentifiers.add(employeeId != null ? employeeId : "MISSING_EMPLOYEE_ID");
                    continue;
                }
                try {
                    User user = new User();
                    user.setEmployeeId(employeeId);
                    user.setFullName(getString(csvRecord, "fullName"));
                    user.setEmail(getString(csvRecord, "email"));
                    user.setPhoneMobile(getString(csvRecord, "phoneMobile"));
                    user.setPhoneOffice(getString(csvRecord, "phoneOffice"));
                    user.setDivision(getString(csvRecord, "division"));
                    user.setDepartment(getString(csvRecord, "department"));
                    user.setDesignation(getString(csvRecord, "designation"));
                    user.setFloorNumber(getString(csvRecord, "floorNumber"));
                    user.setOfficeRoom(getString(csvRecord, "officeRoom"));
                    user.setAddress(getString(csvRecord, "address"));
                    user.setUserRole(getEnum(csvRecord, "userRole", UserRole.class));
                    user.setUserStatus(getEnum(csvRecord, "userStatus", UserStatus.class));
                    user.setBooksIssued(getInteger(csvRecord, "booksIssued"));
                    user.setRegistrationDate(getLocalDateTime(csvRecord, "registrationDate"));
                    user.setExpirationDate(getLocalDate(csvRecord, "expirationDate"));
                    user.setPhotoPath(getString(csvRecord, "photoPath"));
                    user.setEmergencyContact(getString(csvRecord, "emergencyContact"));
                    user.setEmergencyPhone(getString(csvRecord, "emergencyPhone"));
                    user.setRemarks(getString(csvRecord, "remarks"));
                    user.setPassword(passwordEncoder.encode(getString(csvRecord, "password")));
                    userRepository.save(user);
                    successCount++;
                } catch (Exception e) {
                    failedIdentifiers.add(employeeId);
                }
            }
        }
        return new DataImportResultDTO(successCount, failedIdentifiers.size(), failedIdentifiers, "User import process completed.");
    }

    @Override
    public DataImportResultDTO importTransactionsFromCsv(MultipartFile file) throws Exception {
        List<BookIssueDTO> issueDTOs = new ArrayList<>();
        try (Reader reader = new InputStreamReader(file.getInputStream());
             CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader().withIgnoreHeaderCase().withTrim())) {
            for (CSVRecord csvRecord : csvParser) {
                String bookAccessionNumber = getString(csvRecord, "bookAccessionNumber");
                String userEmployeeId = getString(csvRecord, "userEmployeeId");
                if (bookAccessionNumber == null || userEmployeeId == null) {
                    continue;
                }
                Book book = bookRepository.findByAccessionNumber(bookAccessionNumber).orElse(null);
                User user = userRepository.findByEmployeeId(userEmployeeId).orElse(null);

                if (book != null && user != null) {
                    BookIssueDTO issueDTO = new BookIssueDTO();
                    issueDTO.setBookId(book.getId());
                    issueDTO.setUserId(user.getId());
                    issueDTO.setDueDate(getLocalDate(csvRecord, "dueDate"));
                    issueDTO.setIssueDate(getLocalDate(csvRecord, "issueDate"));
                    issueDTO.setTransactionNotes(getString(csvRecord, "transactionNotes"));
                    issueDTOs.add(issueDTO);
                }
            }
        }
        return bookTransactionService.issueBooks(issueDTOs, true);
    }
}
