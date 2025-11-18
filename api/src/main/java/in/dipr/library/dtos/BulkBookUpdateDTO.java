package in.dipr.library.dtos;

import in.dipr.library.enums.BookCondition;
import in.dipr.library.enums.BookStatus;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BulkBookUpdateDTO {

    @NotEmpty(message = "Book IDs list cannot be empty")
    private List<UUID> bookIds;

    private BookStatus bookStatus;
    private BookCondition bookCondition;
    private String locationShelf;
    private String locationRack;
    private String notes;
}