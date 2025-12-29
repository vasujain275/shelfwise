package me.vasujain.shelfwise.dtos;

import me.vasujain.shelfwise.enums.BookStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookStatusUpdateDTO {

    @NotNull(message = "Book status is required")
    private BookStatus bookStatus;

    private String notes;
}
