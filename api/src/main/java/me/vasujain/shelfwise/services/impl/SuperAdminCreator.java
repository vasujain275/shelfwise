package me.vasujain.shelfwise.services.impl;

import me.vasujain.shelfwise.enums.UserRole;
import me.vasujain.shelfwise.enums.UserStatus;
import me.vasujain.shelfwise.models.User;
import me.vasujain.shelfwise.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class SuperAdminCreator implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(SuperAdminCreator.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.super-admin.employee-id}")
    private String superAdminEmployeeId;

    @Value("${app.super-admin.full-name}")
    private String superAdminFullName;

    @Value("${app.super-admin.email}")
    private String superAdminEmail;

    @Value("${app.super-admin.password}")
    private String superAdminPassword;

    @Value("${app.super-admin.department}")
    private String superAdminDepartment;

    @Value("${app.super-admin.division}")
    private String superAdminDivision;

    @Value("${app.super-admin.phone-mobile}")
    private String superAdminPhoneMobile;

    @Value("${app.super-admin.phone-office}")
    private String superAdminPhoneOffice;

    @Value("${app.super-admin.designation}")
    private String superAdminDesignation;

    @Value("${app.super-admin.floor-number}")
    private String superAdminFloorNumber;

    @Value("${app.super-admin.office-room}")
    private String superAdminOfficeRoom;

    @Value("${app.super-admin.address}")
    private String superAdminAddress;

    @Value("${app.super-admin.books-issued}")
    private Integer superAdminBooksIssued;

    @Value("${app.super-admin.photo-path}")
    private String superAdminPhotoPath;

    @Value("${app.super-admin.emergency-contact}")
    private String superAdminEmergencyContact;

    @Value("${app.super-admin.emergency-phone}")
    private String superAdminEmergencyPhone;

    @Value("${app.super-admin.remarks}")
    private String superAdminRemarks;

    @Value("${app.super-admin.expiration-date}")
    private String superAdminExpirationDate;

    public SuperAdminCreator(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.existsByEmployeeId(superAdminEmployeeId)) {
            log.info("Super admin with employee ID {} already exists. Skipping creation.", superAdminEmployeeId);
        } else {
            log.info("Creating super admin with employee ID: {}", superAdminEmployeeId);

            User superAdmin = User.builder()
                    .employeeId(superAdminEmployeeId)
                    .fullName(superAdminFullName)
                    .email(superAdminEmail)
                    .password(passwordEncoder.encode(superAdminPassword))
                    .userRole(UserRole.SUPER_ADMIN)
                    .userStatus(UserStatus.ACTIVE)
                    .department(superAdminDepartment)
                    .division(superAdminDivision)
                    .phoneMobile(superAdminPhoneMobile)
                    .phoneOffice(superAdminPhoneOffice)
                    .designation(superAdminDesignation)
                    .floorNumber(superAdminFloorNumber)
                    .officeRoom(superAdminOfficeRoom)
                    .address(superAdminAddress)
                    .booksIssued(superAdminBooksIssued)
                    .photoPath(superAdminPhotoPath)
                    .emergencyContact(superAdminEmergencyContact)
                    .emergencyPhone(superAdminEmergencyPhone)
                    .remarks(superAdminRemarks)
                    .expirationDate(LocalDate.parse(superAdminExpirationDate))
                    .build();

            userRepository.save(superAdmin);
            log.info("Super admin created successfully with employee ID: {}", superAdminEmployeeId);
        }
    }
}