package in.dipr.library.repositories;

import in.dipr.library.enums.BookCondition;
import in.dipr.library.enums.BookStatus;
import in.dipr.library.enums.BookType;
import in.dipr.library.models.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BookRepository extends JpaRepository<Book, UUID>, JpaSpecificationExecutor<Book> {

    Optional<Book> findByAccessionNumber(String accessionNumber);

    Page<Book> findByIsbn(String isbn, Pageable pageable);

    Page<Book> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    Page<Book> findByAuthorPrimaryContainingIgnoreCaseOrAuthorSecondaryContainingIgnoreCase(String primaryAuthor, String secondaryAuthor, Pageable pageable);

    Page<Book> findByKeywordsContainingIgnoreCase(String keywords, Pageable pageable);

    Page<Book> findByPublisherIgnoreCase(String publisher, Pageable pageable);

    Page<Book> findByPublicationYearBetween(Integer startYear, Integer endYear, Pageable pageable);

    Page<Book> findByBookType(BookType bookType, Pageable pageable);

    Page<Book> findByBookStatus(BookStatus bookStatus, Pageable pageable);

    Page<Book> findByBookCondition(BookCondition bookCondition, Pageable pageable);

    Page<Book> findByLocationShelfAndLocationRack(String shelf, String rack, Pageable pageable);

    Page<Book> findByLocationShelf(String shelf, Pageable pageable);

    Page<Book> findByIsReferenceOnly(boolean isReferenceOnly, Pageable pageable);

    Page<Book> findByClassificationNumberContaining(String classificationNumber, Pageable pageable);

    Page<Book> findByPurchaseDateBetween(LocalDate startDate, LocalDate endDate, Pageable pageable);

    Page<Book> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    Page<Book> findByRegistrationDateBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    Page<Book> findByRegistrationDateAfter(LocalDateTime since, Pageable pageable);

    Page<Book> findByVendorNameIgnoreCase(String vendorName, Pageable pageable);

    @Query("SELECT DISTINCT b.publisher FROM Book b ORDER BY b.publisher")
    List<String> findDistinctPublishers();

    @Query("SELECT DISTINCT b.authorPrimary FROM Book b ORDER BY b.authorPrimary")
    List<String> findDistinctAuthors();

    @Query("SELECT DISTINCT b.vendorName FROM Book b ORDER BY b.vendorName")
    List<String> findDistinctVendors();

    @Query("SELECT DISTINCT b.language FROM Book b ORDER BY b.language")
    List<String> findDistinctLanguages();

    Page<Book> findByLanguageIgnoreCase(String language, Pageable pageable);

    boolean existsByAccessionNumber(String accessionNumber);

    @Modifying
    @Query("UPDATE Book b SET b.bookStatus = :status WHERE b.id IN :bookIds")
    int updateStatusForIds(@Param("status") BookStatus status, @Param("bookIds") List<UUID> bookIds);

    @Modifying
    @Query("UPDATE Book b SET b.bookCondition = :condition WHERE b.id IN :bookIds")
    int updateConditionForIds(@Param("condition") BookCondition condition, @Param("bookIds") List<UUID> bookIds);

    @Query("SELECT COUNT(DISTINCT b.isbn) FROM Book b")
    long countDistinctByIsbn();

    long countByBookStatus(BookStatus bookStatus);

    long countByCreatedAtAfter(LocalDateTime date);
}
