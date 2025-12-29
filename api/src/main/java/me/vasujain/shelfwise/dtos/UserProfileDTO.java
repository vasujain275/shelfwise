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
public class UserProfileDTO {
    private UUID id;
    private String employeeId;
    private String fullName;
    private String email;
    private String phoneMobile;
    private String phoneOffice;
    private String division;
    private String department;
    private String designation;
    private String floorNumber;
    private String officeRoom;
    private String address;
    private UserRole userRole;
    private UserStatus userStatus;
    private LocalDateTime registrationDate;
    private LocalDate expirationDate;
    private String photoPath;
    private String emergencyContact;
    private String emergencyPhone;
    private int currentBorrowedBooksCount;
    private Integer booksIssued;
    private boolean canBorrowBooks;
}
