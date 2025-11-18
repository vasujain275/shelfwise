package in.dipr.library.dtos;

import in.dipr.library.enums.UserRole;
import in.dipr.library.enums.UserStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCreateDTO {

    @NotBlank(message = "Employee ID is required")
    @Size(max = 50, message = "Employee ID must not exceed 50 characters")
    private String employeeId;

    @NotBlank(message = "Full name is required")
    @Size(max = 200, message = "Full name must not exceed 200 characters")
    private String fullName;

    @Email(message = "Invalid email format")
    @Size(max = 200, message = "Email must not exceed 200 characters")
    private String email;

    @Size(max = 15, message = "Mobile phone must not exceed 15 characters")
    private String phoneMobile;

    @Size(max = 15, message = "Office phone must not exceed 15 characters")
    private String phoneOffice;

    @Size(max = 100, message = "Division must not exceed 100 characters")
    private String division;

    @Size(max = 100, message = "Department must not exceed 100 characters")
    private String department;

    @Size(max = 100, message = "Designation must not exceed 100 characters")
    private String designation;

    @Size(max = 10, message = "Floor number must not exceed 10 characters")
    private String floorNumber;

    @Size(max = 20, message = "Office room must not exceed 20 characters")
    private String officeRoom;

    private String address;

    @NotNull(message = "User role is required")
    private UserRole userRole;

    private UserStatus userStatus = UserStatus.ACTIVE;

    private Integer booksIssued = 0;

    private LocalDate expirationDate;

    @Size(max = 500, message = "Photo path must not exceed 500 characters")
    private String photoPath;

    @Size(max = 200, message = "Emergency contact must not exceed 200 characters")
    private String emergencyContact;

    @Size(max = 15, message = "Emergency phone must not exceed 15 characters")
    private String emergencyPhone;

    private String remarks;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;
}