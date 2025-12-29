package me.vasujain.shelfwise.models;

import me.vasujain.shelfwise.enums.BookCondition;
import me.vasujain.shelfwise.enums.BookStatus;
import me.vasujain.shelfwise.enums.BookType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "books", indexes = {
        @Index(name = "idx_accession", columnList = "accessionNumber"),
        @Index(name = "idx_isbn", columnList = "isbn"),
        @Index(name = "idx_title", columnList = "title"),
        @Index(name = "idx_author", columnList = "authorPrimary")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Book extends BaseEntity {

    @Column(name = "accession_number", unique = true, nullable = false, length = 100)
    private String accessionNumber;

    @Column(length = 30)
    private String isbn;

    @Column(length = 512)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String subtitle;

    @Column(name = "author_primary", length = 300)
    private String authorPrimary;

    @Column(name = "author_secondary", columnDefinition = "TEXT")
    private String authorSecondary;

    @Column(length = 300)
    private String publisher;

    @Column(name = "publication_place", length = 200)
    private String publicationPlace;

    @Column(name = "publication_year")
    private Integer publicationYear;

    @Column(length = 150)
    private String edition;

    private String pages;

    @Column(length = 50)
	@lombok.Builder.Default
    private String language = "English";

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "bill_number", length = 200)
    private String billNumber;

    @Column(name = "vendor_name", length = 500)
    private String vendorName;

    @Column(name = "purchase_date")
    private LocalDate purchaseDate;

    @Column(columnDefinition = "TEXT")
    private String keywords;

    @Column(name = "classification_number", length = 150)
    private String classificationNumber;

    @Column(name = "location_shelf", length = 100)
    private String locationShelf;

    @Column(name = "location_rack", length = 100)
    private String locationRack;

    @Enumerated(EnumType.STRING)
    @Column(name = "book_condition")
	@lombok.Builder.Default
    private BookCondition bookCondition = BookCondition.GOOD;

    @Enumerated(EnumType.STRING)
    @Column(name = "book_status", nullable = false)
	@lombok.Builder.Default
    private BookStatus bookStatus = BookStatus.AVAILABLE;

    @Column(name = "total_copies")
	@lombok.Builder.Default
    private Integer totalCopies = 1;

    @Column(name = "available_copies")
	@lombok.Builder.Default
    private Integer availableCopies = 1;

    @Enumerated(EnumType.STRING)
    @Column(name = "book_type", nullable = false)
	@lombok.Builder.Default
    private BookType bookType = BookType.GENERAL;

    @Column(name = "is_reference_only")
	@lombok.Builder.Default
    private Boolean isReferenceOnly = false;

    @Column(name = "registration_date")
	@lombok.Builder.Default
    private LocalDateTime registrationDate = LocalDateTime.now();

    @Column(columnDefinition = "TEXT")
    private String notes;

    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<BookTransaction> transactions;
}
