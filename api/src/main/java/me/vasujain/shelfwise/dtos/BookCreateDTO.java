package me.vasujain.shelfwise.dtos;

import me.vasujain.shelfwise.enums.BookCondition;
import me.vasujain.shelfwise.enums.BookStatus;
import me.vasujain.shelfwise.enums.BookType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookCreateDTO {

    @NotBlank(message = "Accession number is required")
    @Size(max = 100, message = "Accession number must not exceed 50 characters")
    private String accessionNumber;

    @Size(max = 30, message = "ISBN must not exceed 20 characters")
    private String isbn;

    @Size(max = 512, message = "Title must not exceed 512 characters")
    private String title;

    private String subtitle;

    @Size(max = 300, message = "Primary author must not exceed 200 characters")
    private String authorPrimary;

    private String authorSecondary;

    @Size(max = 300, message = "Publisher must not exceed 200 characters")
    private String publisher;

    @Size(max = 200, message = "Publication place must not exceed 100 characters")
    private String publicationPlace;

    @Min(value = 1000, message = "Publication year must be at least 1000")
    @Max(value = 9999, message = "Publication year must not exceed 9999")
    private Integer publicationYear;

    @Size(max = 150, message = "Edition must not exceed 50 characters")
    private String edition;

    private String pages;

    @Size(max = 50, message = "Language must not exceed 50 characters")
    private String language;

    @DecimalMin(value = "0.00", message = "Price must be positive")
    @Digits(integer = 8, fraction = 2, message = "Price must have at most 8 integer digits and 2 decimal places")
    private BigDecimal price;

    @Size(max = 200, message = "Bill number must not exceed 100 characters")
    private String billNumber;

    @Size(max = 500, message = "Vendor name must not exceed 200 characters")
    private String vendorName;

    private String purchaseDate;

    private String keywords;

    @Size(max = 150, message = "Classification number must not exceed 50 characters")
    private String classificationNumber;

    @Size(max = 100, message = "Location shelf must not exceed 50 characters")
    private String locationShelf;

    @Size(max = 100, message = "Location rack must not exceed 50 characters")
    private String locationRack;

    // Removed @NotNull - will be set to defaults in service if null
    private BookCondition bookCondition;

    // Removed @NotNull - will be set to defaults in service if null
    private BookStatus bookStatus;

    @Min(value = 1, message = "Total copies must be at least 1")
    private Integer totalCopies;

    @Min(value = 0, message = "Available copies cannot be negative")
    private Integer availableCopies;

    // Removed @NotNull - will be set to defaults in service if null
    private BookType bookType;

    private Boolean isReferenceOnly;

    private String notes;
}