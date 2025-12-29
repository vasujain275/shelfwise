package me.vasujain.shelfwise.dtos;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserExpirationUpdateDTO {

    @NotNull(message = "New expiration date is required")
    @Future(message = "Expiration date must be in the future")
    private LocalDate newExpirationDate;

    private String reason;
}
