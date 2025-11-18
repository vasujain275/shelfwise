package in.dipr.library.dtos;

import in.dipr.library.enums.BookCondition;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookConditionUpdateDTO {

    @NotNull(message = "Book condition is required")
    private BookCondition bookCondition;

    private String notes;
}
