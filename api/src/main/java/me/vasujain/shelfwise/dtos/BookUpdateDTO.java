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
public class BookUpdateDTO {

    private String isbn;

    @Size(max = 512, message = "Title must not exceed 512 characters")
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

    private String notes;
}
