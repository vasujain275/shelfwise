package in.dipr.library.dtos;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookLocationUpdateDTO {

    @Size(max = 100, message = "Location shelf must not exceed 50 characters")
    private String locationShelf;

    @Size(max = 100, message = "Location rack must not exceed 50 characters")
    private String locationRack;
}