package in.dipr.library.dtos;

import in.dipr.library.enums.UserRole;
import in.dipr.library.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class UserDTO {
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
    private Integer booksIssued;
    private LocalDateTime registrationDate;
    private LocalDate expirationDate;
    private String photoPath;
    private String emergencyContact;
    private String emergencyPhone;
    private String remarks;
    private int currentBorrowedBooksCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
