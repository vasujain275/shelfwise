// BookServiceImpl.java
package me.vasujain.shelfwise.services.impl;

import me.vasujain.shelfwise.dtos.BookCreateDTO;
import me.vasujain.shelfwise.dtos.BookUpdateDTO;
import me.vasujain.shelfwise.dtos.BookDTO;
import me.vasujain.shelfwise.enums.BookStatus;
import me.vasujain.shelfwise.exceptions.BookNotFoundException;
import me.vasujain.shelfwise.exceptions.DuplicateAccessionNumberException;
import me.vasujain.shelfwise.models.Book;
import me.vasujain.shelfwise.repositories.BookRepository;
import me.vasujain.shelfwise.services.BookService;
import me.vasujain.shelfwise.mapper.BookMapper;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final BookMapper bookMapper;

    @Override
    public BookDTO registerBook(BookCreateDTO bookCreateDTO) {
        if (bookRepository.existsByAccessionNumber(bookCreateDTO.getAccessionNumber())) {
            throw new DuplicateAccessionNumberException("Book can't be created due to accession number " + bookCreateDTO.getAccessionNumber() + " already existing.");
        }

        log.info("Registering a new book with title: {}", bookCreateDTO.getTitle());
        // Basic builder pattern for entity creation
        Book book = Book.builder()
                .accessionNumber(bookCreateDTO.getAccessionNumber())
                .isbn(bookCreateDTO.getIsbn())
                .title(bookCreateDTO.getTitle())
                .subtitle(bookCreateDTO.getSubtitle())
                .authorPrimary(bookCreateDTO.getAuthorPrimary())
                .authorSecondary(bookCreateDTO.getAuthorSecondary())
                .publisher(bookCreateDTO.getPublisher())
                .publicationPlace(bookCreateDTO.getPublicationPlace())
                .publicationYear(bookCreateDTO.getPublicationYear())
                .edition(bookCreateDTO.getEdition())
                .pages(bookCreateDTO.getPages())
                .language(bookCreateDTO.getLanguage())
                .price(bookCreateDTO.getPrice())
                .billNumber(bookCreateDTO.getBillNumber())
                .vendorName(bookCreateDTO.getVendorName())
                .purchaseDate(parseFlexibleDate(bookCreateDTO.getPurchaseDate()))
                .keywords(bookCreateDTO.getKeywords())
                .classificationNumber(bookCreateDTO.getClassificationNumber())
                .locationShelf(bookCreateDTO.getLocationShelf())
                .locationRack(bookCreateDTO.getLocationRack())
                .bookCondition(bookCreateDTO.getBookCondition())
                .bookStatus(bookCreateDTO.getBookStatus())
                .totalCopies(bookCreateDTO.getTotalCopies())
                .availableCopies(bookCreateDTO.getAvailableCopies())
                .bookType(bookCreateDTO.getBookType())
                .isReferenceOnly(bookCreateDTO.getIsReferenceOnly())
                .notes(bookCreateDTO.getNotes())
                .registrationDate(LocalDateTime.now())
                .build();
        return bookMapper.toDto(bookRepository.save(book));
    }

    @Override
    public Map<String, Object> registerBulkBooks(List<BookCreateDTO> bookCreateDTOs) {
        log.info("Registering {} new books in bulk", bookCreateDTOs.size());
        List<String> failedAccessionNumbers = new ArrayList<>();
        int createdCount = 0;

        for (BookCreateDTO bookCreateDTO : bookCreateDTOs) {
            try {
                if (bookRepository.existsByAccessionNumber(bookCreateDTO.getAccessionNumber())) {
                    log.warn("Book with accession number {} already exists. Skipping.", bookCreateDTO.getAccessionNumber());
                    failedAccessionNumbers.add(bookCreateDTO.getAccessionNumber());
                    continue;
                }

                log.info("Attempting to register book with accession number: {}", bookCreateDTO.getAccessionNumber());
                Book book = Book.builder()
                        .accessionNumber(bookCreateDTO.getAccessionNumber())
                        .isbn(bookCreateDTO.getIsbn())
                        .title(bookCreateDTO.getTitle())
                        .subtitle(bookCreateDTO.getSubtitle())
                        .authorPrimary(bookCreateDTO.getAuthorPrimary())
                        .authorSecondary(bookCreateDTO.getAuthorSecondary())
                        .publisher(bookCreateDTO.getPublisher())
                        .publicationPlace(bookCreateDTO.getPublicationPlace())
                        .publicationYear(bookCreateDTO.getPublicationYear())
                        .edition(bookCreateDTO.getEdition())
                        .pages(bookCreateDTO.getPages())
                        .language(bookCreateDTO.getLanguage())
                        .price(bookCreateDTO.getPrice())
                        .billNumber(bookCreateDTO.getBillNumber())
                        .vendorName(bookCreateDTO.getVendorName())
                        .purchaseDate(parseFlexibleDate(bookCreateDTO.getPurchaseDate()))
                        .keywords(bookCreateDTO.getKeywords())
                        .classificationNumber(bookCreateDTO.getClassificationNumber())
                        .locationShelf(bookCreateDTO.getLocationShelf())
                        .locationRack(bookCreateDTO.getLocationRack())
                        .bookCondition(bookCreateDTO.getBookCondition())
                        .bookStatus(bookCreateDTO.getBookStatus())
                        .totalCopies(bookCreateDTO.getTotalCopies())
                        .availableCopies(bookCreateDTO.getAvailableCopies())
                        .bookType(bookCreateDTO.getBookType())
                        .isReferenceOnly(bookCreateDTO.getIsReferenceOnly())
                        .notes(bookCreateDTO.getNotes())
                        .registrationDate(LocalDateTime.now())
                        .build();

                bookRepository.save(book);
                createdCount++;
            } catch (Exception e) {
                log.error("Failed to register book with accession number {}: {}", bookCreateDTO.getAccessionNumber(), e.getMessage());
                failedAccessionNumbers.add(bookCreateDTO.getAccessionNumber());
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("booksCreated", createdCount);
        result.put("failedAccessionNumbers", failedAccessionNumbers);

        return result;
    }

    @Override
    public BookDTO updateBook(UUID id, BookUpdateDTO bookUpdateDTO) {
        log.info("Updating book with ID: {}", id);
        Book book = getBookById(id);
        // Update fields from DTO if they are provided
        book.setTitle(bookUpdateDTO.getTitle());
        book.setAuthorPrimary(bookUpdateDTO.getAuthorPrimary());
        book.setIsbn(bookUpdateDTO.getIsbn());
        book.setSubtitle(bookUpdateDTO.getSubtitle());
        book.setAuthorSecondary(bookUpdateDTO.getAuthorSecondary());
        book.setPublisher(bookUpdateDTO.getPublisher());
        book.setPublicationPlace(bookUpdateDTO.getPublicationPlace());
        book.setPublicationYear(bookUpdateDTO.getPublicationYear());
        book.setEdition(bookUpdateDTO.getEdition());
        book.setPages(bookUpdateDTO.getPages());
        book.setLanguage(bookUpdateDTO.getLanguage());
        book.setPrice(bookUpdateDTO.getPrice());
        book.setBillNumber(bookUpdateDTO.getBillNumber());
        book.setVendorName(bookUpdateDTO.getVendorName());
        book.setPurchaseDate(bookUpdateDTO.getPurchaseDate());
        book.setKeywords(bookUpdateDTO.getKeywords());
        book.setClassificationNumber(bookUpdateDTO.getClassificationNumber());
        book.setLocationShelf(bookUpdateDTO.getLocationShelf());
        book.setLocationRack(bookUpdateDTO.getLocationRack());
        book.setBookCondition(bookUpdateDTO.getBookCondition());
        book.setBookStatus(bookUpdateDTO.getBookStatus());
        book.setTotalCopies(bookUpdateDTO.getTotalCopies());
        book.setAvailableCopies(bookUpdateDTO.getAvailableCopies());
        book.setBookType(bookUpdateDTO.getBookType());
        book.setIsReferenceOnly(bookUpdateDTO.getIsReferenceOnly());
        book.setNotes(bookUpdateDTO.getNotes());
        return bookMapper.toDto(bookRepository.save(book));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookDTO> getAllBooks(Pageable pageable) {
        return bookRepository.findAll(pageable).map(bookMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public BookDTO getBook(UUID id) {
        return bookMapper.toDto(getBookById(id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookDTO> search(String query, Pageable pageable) {
        log.debug("Performing a unified search for query: {}", query);
        Specification<Book> spec = createSearchSpecification(query);
        return bookRepository.findAll(spec, pageable).map(bookMapper::toDto);
    }

    @Override
    public void deleteBook(UUID id) {
        log.info("Soft deleting book with ID: {}", id);
        Book book = getBookById(id);
        book.setBookStatus(BookStatus.UNAVAILABLE); // Assuming soft delete logic
        bookRepository.save(book);
    }

    // ===============================
    // PRIVATE HELPER METHODS
    // ===============================

    private Book getBookById(UUID id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException("Book not found with ID: " + id));
    }

    /**
     * Creates a JPA Specification for a unified, multi-field search.
     * This method builds a query that searches the provided term across title, authors,
     * publisher, accession number, and keywords. The search is case-insensitive.
     *
     * @param query The string to search for.
     * @return A Specification object for the Book entity.
     */
    private Specification<Book> createSearchSpecification(String query) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            if (!StringUtils.hasText(query)) {
                return criteriaBuilder.conjunction(); // Return no results if query is empty
            }

            String fuzzyQuery = "%" + query.toLowerCase() + "%";

            List<Predicate> predicates = new ArrayList<>();
            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), fuzzyQuery));
            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("subtitle")), fuzzyQuery));
            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("authorPrimary")), fuzzyQuery));
            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("notes")), fuzzyQuery));
            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("authorSecondary")), fuzzyQuery));
            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("publisher")), fuzzyQuery));
            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("accessionNumber")), fuzzyQuery));
            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("keywords")), fuzzyQuery));
            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("isbn")), fuzzyQuery));
            try {
                Integer publicationYear = Integer.parseInt(query);
                predicates.add(criteriaBuilder.equal(root.get("publicationYear"), publicationYear));
            } catch (NumberFormatException e) {
                // Ignore if the query is not a valid year
            }
            return criteriaBuilder.or(predicates.toArray(new Predicate[0]));
        };
    }

    private LocalDate parseFlexibleDate(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty() || dateStr.trim().equals("0")) {
            return null;
        }

        try {
            // Handle long (epoch seconds) to LocalDate
            if (dateStr.matches("^\\d+$")) {
                long epochSeconds = Long.parseLong(dateStr);
                if (epochSeconds == 0) return null;
                return LocalDate.ofEpochDay(epochSeconds / 86400);
            }

            // Handle various date formats
            DateTimeFormatter formatter1 = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            DateTimeFormatter formatter2 = DateTimeFormatter.ofPattern("yyyy-M-d");
            DateTimeFormatter formatter3 = DateTimeFormatter.ofPattern("M/d/yyyy");

            try {
                return LocalDate.parse(dateStr, formatter1);
            } catch (DateTimeParseException e1) {
                try {
                    return LocalDate.parse(dateStr, formatter2);
                } catch (DateTimeParseException e2) {
                    try {
                        return LocalDate.parse(dateStr, formatter3);
                    } catch (DateTimeParseException e3) {
                        log.warn("Could not parse date: {}", dateStr);
                        return null;
                    }
                }
            }
        } catch (Exception e) {
            log.error("An unexpected error occurred while parsing date string: {}", dateStr, e);
            return null;
        }
    }
}
