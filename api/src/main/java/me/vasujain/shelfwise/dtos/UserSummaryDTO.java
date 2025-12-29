package me.vasujain.shelfwise.dtos;

import me.vasujain.shelfwise.enums.UserRole;
import me.vasujain.shelfwise.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryDTO {
    private UUID id;
    private String employeeId;
    private String fullName;
    private String email;
    private String department;
    private String division;
    private UserRole userRole;
    private UserStatus userStatus;
    private LocalDate expirationDate;
    private LocalDateTime registrationDate;
    private int currentBorrowedBooksCount;
    private Integer booksIssued;
}