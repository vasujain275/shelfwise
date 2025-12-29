package me.vasujain.shelfwise.dtos;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookRenewDTO {
    @NotNull(message = "Transaction ID is required")
    private UUID transactionId;

    @NotNull(message = "New due date is required")
    @Future(message = "New due date must be in the future")
    private LocalDate newDueDate;

    private String transactionNotes;
}
