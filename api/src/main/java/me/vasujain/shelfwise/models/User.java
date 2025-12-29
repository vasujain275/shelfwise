package me.vasujain.shelfwise.models;

import me.vasujain.shelfwise.enums.UserRole;
import me.vasujain.shelfwise.enums.UserStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_employee_id", columnList = "employeeId"),
        @Index(name = "idx_email", columnList = "email"),
        @Index(name = "idx_full_name", columnList = "fullName"),
        @Index(name = "idx_role", columnList = "userRole"),
        @Index(name = "idx_status", columnList = "userStatus")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class User extends BaseEntity implements UserDetails {

    @Column(name = "employee_id", unique = true, nullable = false, length = 50)
    private String employeeId;

    @Column(name = "full_name", nullable = false, length = 200)
    private String fullName;

    @Column(unique = true, length = 200)
    private String email;

    @Column(name = "phone_mobile", length = 15)
    private String phoneMobile;

    @Column(name = "phone_office", length = 15)
    private String phoneOffice;

    @Column(length = 100)
    private String division;

    @Column(length = 100)
    private String department;

    @Column(length = 100)
    private String designation;

    @Column(name = "floor_number", length = 10)
    private String floorNumber;

    @Column(name = "office_room", length = 20)
    private String officeRoom;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_role", nullable = false)
    private UserRole userRole;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_status")
	@lombok.Builder.Default
    private UserStatus userStatus = UserStatus.ACTIVE;

    @Column(name = "books_issued")
	@lombok.Builder.Default
    private Integer booksIssued = 0;

    @Column(name = "registration_date")
	@lombok.Builder.Default
    private LocalDateTime registrationDate = LocalDateTime.now();

    @Column(name = "expiration_date")
    private LocalDate expirationDate;

    @Column(name = "photo_path", length = 500)
    private String photoPath;

    @Column(name = "emergency_contact", length = 200)
    private String emergencyContact;

    @Column(name = "emergency_phone", length = 15)
    private String emergencyPhone;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    // For Spring Security
    @Column(nullable = false)
    private String password;

    @Column(name = "refresh_token", length = 512)
    private String refreshToken;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<BookTransaction> borrowedBooks;

    @OneToMany(mappedBy = "issuedBy", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<BookTransaction> issuedTransactions;

    @OneToMany(mappedBy = "returnedTo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<BookTransaction> returnedTransactions;

    // Spring Security UserDetails implementation
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + userRole.name()));
    }

    @Override
    public String getUsername() {
        return employeeId;
    }

    @Override
    public boolean isAccountNonExpired() {
        return expirationDate == null || expirationDate.isAfter(LocalDate.now());
    }

    @Override
    public boolean isAccountNonLocked() {
        return !UserStatus.SUSPENDED.equals(userStatus);
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return UserStatus.ACTIVE.equals(userStatus);
    }
}