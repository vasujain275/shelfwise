package me.vasujain.shelfwise.dtos;

import me.vasujain.shelfwise.enums.BookCondition;
import me.vasujain.shelfwise.enums.BookStatus;
import me.vasujain.shelfwise.enums.BookType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookSearchDTO {

    @Size(max = 512, message = "Title must not exceed 512 characters")
    private String title;
    private String author;
    private String isbn;
    private String publisher;
    private String keywords;
    private String accessionNumber;
    private String classificationNumber;
    private String language;
    private String vendorName;

    private Integer publicationYear;
    private Integer publicationYearFrom;
    private Integer publicationYearTo;

    private BigDecimal priceFrom;
    private BigDecimal priceTo;

    private LocalDate purchaseDateFrom;
    private LocalDate purchaseDateTo;

    private LocalDate registrationDateFrom;
    private LocalDate registrationDateTo;

    private BookType bookType;
    private BookStatus bookStatus;
    private BookCondition bookCondition;

    private String locationShelf;
    private String locationRack;

    private Boolean isReferenceOnly;
    private Boolean isAvailable;

    private String minPages;
    private String maxPages;
}