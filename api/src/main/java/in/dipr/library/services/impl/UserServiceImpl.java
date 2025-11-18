package in.dipr.library.services.impl;

import in.dipr.library.dtos.*;
import in.dipr.library.enums.UserRole;
import in.dipr.library.enums.UserStatus;
import in.dipr.library.exceptions.DuplicateEmailException;
import in.dipr.library.exceptions.DuplicateEmployeeIdException;
import in.dipr.library.exceptions.UserNotFoundException;
import in.dipr.library.models.User;
import in.dipr.library.repositories.UserRepository;
import in.dipr.library.services.UserService;
import in.dipr.library.services.AuthenticationService;
import in.dipr.library.mapper.UserMapper;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final AuthenticationService authenticationService;

    @Override
    public UserDTO registerUser(UserCreateDTO userCreateDTO) {
        log.info("Registering new user with employee ID: {}", userCreateDTO.getEmployeeId());
        if (userRepository.existsByEmployeeId(userCreateDTO.getEmployeeId())) {
            throw new DuplicateEmployeeIdException("User can't be created due to employee ID " + userCreateDTO.getEmployeeId() + " already existing.");
        }
        if (userRepository.existsByEmail(userCreateDTO.getEmail())) {
            throw new DuplicateEmailException("User can't be created due to email " + userCreateDTO.getEmail() + " already existing.");
        }

        User currentUser = authenticationService.getAuthenticatedUser();
        if (currentUser.getUserRole() == UserRole.ADMIN && (userCreateDTO.getUserRole() == UserRole.ADMIN || userCreateDTO.getUserRole() == UserRole.SUPER_ADMIN)) {
            throw new AccessDeniedException("Admins are not allowed to create or promote other users to ADMIN or SUPER_ADMIN roles.");
        }
        User user = User.builder()
                .employeeId(userCreateDTO.getEmployeeId())
                .fullName(userCreateDTO.getFullName())
                .email(userCreateDTO.getEmail())
                .phoneMobile(userCreateDTO.getPhoneMobile())
                .phoneOffice(userCreateDTO.getPhoneOffice())
                .division(userCreateDTO.getDivision())
                .department(userCreateDTO.getDepartment())
                .designation(userCreateDTO.getDesignation())
                .floorNumber(userCreateDTO.getFloorNumber())
                .officeRoom(userCreateDTO.getOfficeRoom())
                .address(userCreateDTO.getAddress())
                .userRole(userCreateDTO.getUserRole())
                .userStatus(userCreateDTO.getUserStatus())
                .booksIssued(userCreateDTO.getBooksIssued())
                .expirationDate(userCreateDTO.getExpirationDate())
                .photoPath(userCreateDTO.getPhotoPath())
                .emergencyContact(userCreateDTO.getEmergencyContact())
                .emergencyPhone(userCreateDTO.getEmergencyPhone())
                .remarks(userCreateDTO.getRemarks())
                .password(passwordEncoder.encode(userCreateDTO.getPassword()))
                .build();
        return userMapper.toDto(userRepository.save(user));
    }

    @Override
    public UserDTO updateUser(UUID id, UserUpdateDTO userUpdateDTO) {
        log.info("Updating user with ID: {}", id);
        User user = getUserEntity(id);
        if (StringUtils.hasText(userUpdateDTO.getFullName())) {
            user.setFullName(userUpdateDTO.getFullName());
        }
        if (StringUtils.hasText(userUpdateDTO.getEmail())) {
            if (userRepository.existsByEmailAndIdNot(userUpdateDTO.getEmail(), id)) {
                throw new DuplicateEmailException("User can't be updated due to email " + userUpdateDTO.getEmail() + " already being in use by another user.");
            }
            user.setEmail(userUpdateDTO.getEmail());
        }
        if (StringUtils.hasText(userUpdateDTO.getPhoneMobile())) {
            user.setPhoneMobile(userUpdateDTO.getPhoneMobile());
        }
        if (StringUtils.hasText(userUpdateDTO.getPhoneOffice())) {
            user.setPhoneOffice(userUpdateDTO.getPhoneOffice());
        }
        if (StringUtils.hasText(userUpdateDTO.getDivision())) {
            user.setDivision(userUpdateDTO.getDivision());
        }
        if (StringUtils.hasText(userUpdateDTO.getDepartment())) {
            user.setDepartment(userUpdateDTO.getDepartment());
        }
        if (StringUtils.hasText(userUpdateDTO.getDesignation())) {
            user.setDesignation(userUpdateDTO.getDesignation());
        }
        if (StringUtils.hasText(userUpdateDTO.getFloorNumber())) {
            user.setFloorNumber(userUpdateDTO.getFloorNumber());
        }
        if (StringUtils.hasText(userUpdateDTO.getOfficeRoom())) {
            user.setOfficeRoom(userUpdateDTO.getOfficeRoom());
        }
        if (StringUtils.hasText(userUpdateDTO.getAddress())) {
            user.setAddress(userUpdateDTO.getAddress());
        }
        if (userUpdateDTO.getUserRole() != null) {
            User currentUser = authenticationService.getAuthenticatedUser();
            if (currentUser.getUserRole() == UserRole.ADMIN && (userUpdateDTO.getUserRole() == UserRole.ADMIN || userUpdateDTO.getUserRole() == UserRole.SUPER_ADMIN)) {
                throw new AccessDeniedException("Admins are not allowed to create or promote other users to ADMIN or SUPER_ADMIN roles.");
            }
            user.setUserRole(userUpdateDTO.getUserRole());
        }
        if (userUpdateDTO.getUserStatus() != null) {
            user.setUserStatus(userUpdateDTO.getUserStatus());
        }
        if (userUpdateDTO.getBooksIssued() != null) {
            user.setBooksIssued(userUpdateDTO.getBooksIssued());
        }
        user.setExpirationDate(userUpdateDTO.getExpirationDate());
        if (StringUtils.hasText(userUpdateDTO.getPhotoPath())) {
            user.setPhotoPath(userUpdateDTO.getPhotoPath());
        }
        if (StringUtils.hasText(userUpdateDTO.getEmergencyContact())) {
            user.setEmergencyContact(userUpdateDTO.getEmergencyContact());
        }
        if (StringUtils.hasText(userUpdateDTO.getEmergencyPhone())) {
            user.setEmergencyPhone(userUpdateDTO.getEmergencyPhone());
        }
        if (StringUtils.hasText(userUpdateDTO.getRemarks())) {
            user.setRemarks(userUpdateDTO.getRemarks());
        }
        return userMapper.toDto(userRepository.save(user));
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO getUser(UUID id) {
        return userMapper.toDto(getUserEntity(id));
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO getUserByEmployeeId(String employeeId) {
        User user = userRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new UserNotFoundException("User not found with employee ID: " + employeeId));
        return userMapper.toDto(user);
    }

    

    @Override
    @Transactional(readOnly = true)
    public Page<UserDTO> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(userMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserDTO> search(String query, Pageable pageable) {
        log.debug("Performing unified user search for query: {}", query);
        Specification<User> spec = createSearchSpecification(query);
        return userRepository.findAll(spec, pageable).map(userMapper::toDto);
    }

    @Override
    public UserDTO updateUserStatus(UUID userId, UserStatus status) {
        log.info("Updating status for user ID: {} to {}", userId, status);
        User user = getUserEntity(userId);
        user.setUserStatus(status);
        return userMapper.toDto(userRepository.save(user));
    }

    @Override
    public UserDTO updatePassword(UUID userId, PasswordUpdateDTO passwordUpdateDTO) {
        log.info("Updating password for user ID: {}", userId);
        User user = getUserEntity(userId);
        if (!passwordEncoder.matches(passwordUpdateDTO.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect.");
        }
        user.setPassword(passwordEncoder.encode(passwordUpdateDTO.getNewPassword()));
        return userMapper.toDto(userRepository.save(user));
    }

    @Override
    public void deleteUser(UUID id) {
        log.info("Soft deleting user with ID: {}", id);
        User user = getUserEntity(id);
        user.setUserStatus(UserStatus.INACTIVE); // Soft delete
        userRepository.save(user);
    }

    @Override
    public void changePassword(PasswordUpdateDTO passwordUpdateDTO) {
        User currentUser = authenticationService.getAuthenticatedUser();
        log.info("Changing password for user ID: {}", currentUser.getId());

        if (!passwordEncoder.matches(passwordUpdateDTO.getCurrentPassword(), currentUser.getPassword())) {
            throw new IllegalArgumentException("Incorrect old password.");
        }

        currentUser.setPassword(passwordEncoder.encode(passwordUpdateDTO.getNewPassword()));
        userRepository.save(currentUser);
    }

    @Override
    public void resetPassword(UUID userId, PasswordResetDTO passwordResetDTO) {
        User currentUser = authenticationService.getAuthenticatedUser();
        log.info("Resetting password for user ID: {} by admin user ID: {}", userId, currentUser.getId());

        User userToReset = getUserEntity(userId);

        if (currentUser.getUserRole() == UserRole.ADMIN && userToReset.getUserRole() != UserRole.MEMBER) {
            throw new AccessDeniedException("Admins can only reset passwords for members.");
        }

        userToReset.setPassword(passwordEncoder.encode(passwordResetDTO.getNewPassword()));
        userRepository.save(userToReset);
    }

    // ===============================
    // PRIVATE HELPER METHODS
    // ===============================

    private User getUserEntity(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + id));
    }

    /**
     * Creates a JPA Specification for a unified, multi-field user search.
     * This method builds a query that searches the term across full name, employee ID,
     * email, department, and division. The search is case-insensitive.
     */
    private Specification<User> createSearchSpecification(String query) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            if (!StringUtils.hasText(query)) {
                return criteriaBuilder.conjunction();
            }

            String fuzzyQuery = "%" + query.toLowerCase() + "%";

            List<Predicate> predicates = new ArrayList<>();
            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("fullName")), fuzzyQuery));
            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("employeeId")), fuzzyQuery));
            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), fuzzyQuery));
            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("department")), fuzzyQuery));
            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("division")), fuzzyQuery));

            return criteriaBuilder.or(predicates.toArray(new Predicate[0]));
        };
    }

    
}