package me.vasujain.shelfwise.dtos;

import me.vasujain.shelfwise.enums.TransactionStatus;
import me.vasujain.shelfwise.enums.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookTransactionDTO {
    private UUID id;
    private UUID bookId;
    private String bookTitle;
    private String accessionNumber;
    private UUID userId;
    private String employeeId;
    private String userFullName;
    private TransactionType transactionType;
    private LocalDateTime issueDate;
    private LocalDate dueDate;
    private LocalDateTime returnDate;
    private Integer renewalCount;
    private UUID issuedByUserId;
    private String issuedByUserFullName;
    private UUID returnedToUserId;
    private String returnedToUserFullName;
    private TransactionStatus status;
    private String transactionNotes;
}
