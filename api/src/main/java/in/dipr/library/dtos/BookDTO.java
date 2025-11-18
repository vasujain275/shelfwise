package in.dipr.library.dtos;

import in.dipr.library.enums.BookCondition;
import in.dipr.library.enums.BookStatus;
import in.dipr.library.enums.BookType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class BookDTO {
    private UUID id;
    private String accessionNumber;
    private String isbn;
    private String title;
    private String subtitle;
    private String authorPrimary;
    private String authorSecondary;
    private String publisher;
    private String publicationPlace;
    private Integer publicationYear;
    private String edition;
    private String pages;
    private String language;
    private BigDecimal price;
    private String billNumber;
    private String vendorName;
    private LocalDate purchaseDate;
    private String keywords;
    private String classificationNumber;
    private String locationShelf;
    private String locationRack;
    private BookCondition bookCondition;
    private BookStatus bookStatus;
    private Integer totalCopies;
    private Integer availableCopies;
    private BookType bookType;
    private Boolean isReferenceOnly;
    private LocalDateTime registrationDate;
    private String notes;
}