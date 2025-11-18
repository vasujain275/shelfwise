package in.dipr.library.repositories;

import in.dipr.library.enums.TransactionStatus;
import in.dipr.library.enums.UserRole;
import in.dipr.library.enums.UserStatus;
import in.dipr.library.models.BookTransaction;
import in.dipr.library.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID>, JpaSpecificationExecutor<User> {

    

    // Basic finder methods
    Optional<User> findByEmployeeId(String employeeId);

    Optional<User> findByEmail(String email);

    Optional<User> findByRefreshToken(String refreshToken);

    // Search methods with case-insensitive matching
    Page<User> findByFullNameContainingIgnoreCase(String fullName, Pageable pageable);

    // Filter by role and status
    Page<User> findByUserRole(UserRole userRole, Pageable pageable);

    Page<User> findByUserStatus(UserStatus userStatus, Pageable pageable);

    // Department and division filters
    Page<User> findByDepartmentIgnoreCase(String department, Pageable pageable);

    Page<User> findByDivisionIgnoreCase(String division, Pageable pageable);

    // Account expiration queries
    Page<User> findByExpirationDateLessThanEqualAndUserStatus(
            LocalDate expirationDate,
            UserStatus userStatus,
            Pageable pageable
    );

    // Existence checks for unique constraints
    boolean existsByEmployeeId(String employeeId);

    boolean existsByEmail(String email);

    // Existence checks excluding specific user (for updates)
    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u " +
            "WHERE u.employeeId = :employeeId AND u.id != :excludeId")
    boolean existsByEmployeeIdAndIdNot(@Param("employeeId") String employeeId,
                                       @Param("excludeId") UUID excludeId);

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u " +
            "WHERE u.email = :email AND u.id != :excludeId")
    boolean existsByEmailAndIdNot(@Param("email") String email,
                                  @Param("excludeId") UUID excludeId);

    // Additional useful queries for analytics and reporting

    /**
     * Count users by role
     */
    long countByUserRole(UserRole userRole);

    long countByUserStatus(UserStatus userStatus);

    long countByCreatedAtAfter(java.time.LocalDateTime date);

    /**
     * Find users by department and status
     */
    Page<User> findByDepartmentIgnoreCaseAndUserStatus(
            String department,
            UserStatus userStatus,
            Pageable pageable
    );

    /**
     * Find users by division and status
     */
    Page<User> findByDivisionIgnoreCaseAndUserStatus(
            String division,
            UserStatus userStatus,
            Pageable pageable
    );

    /**
     * Find users with expiration date between dates
     */
    Page<User> findByExpirationDateBetween(
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable
    );

    /**
     * Find users registered between dates
     */
    @Query("SELECT u FROM User u WHERE u.registrationDate >= :startDate AND u.registrationDate <= :endDate")
    Page<User> findByRegistrationDateBetween(
            @Param("startDate") java.time.LocalDateTime startDate,
            @Param("endDate") java.time.LocalDateTime endDate,
            Pageable pageable
    );

    /**
     * Find users by multiple roles
     */
    Page<User> findByUserRoleIn(java.util.List<UserRole> roles, Pageable pageable);

    /**
     * Find users by multiple statuses
     */
    Page<User> findByUserStatusIn(java.util.List<UserStatus> statuses, Pageable pageable);

    /**
     * Find users with null or empty refresh token
     */
    @Query("SELECT u FROM User u WHERE u.refreshToken IS NULL OR u.refreshToken = ''")
    Page<User> findUsersWithoutRefreshToken(Pageable pageable);

    /**
     * Find users with active refresh tokens
     */
    @Query("SELECT u FROM User u WHERE u.refreshToken IS NOT NULL AND u.refreshToken != ''")
    Page<User> findUsersWithActiveRefreshToken(Pageable pageable);

    

    /**
     * Get users with high book borrowing activity
     */
    @Query("SELECT u FROM User u WHERE u.booksIssued >= :minBooks ORDER BY u.booksIssued DESC")
    Page<User> findHighActivityUsers(@Param("minBooks") Integer minBooks, Pageable pageable);

    /**
     * Find users by designation (job title)
     */
    Page<User> findByDesignationContainingIgnoreCase(String designation, Pageable pageable);

    /**
     * Find users by floor number
     */
    Page<User> findByFloorNumber(String floorNumber, Pageable pageable);

    /**
     * Custom query to find users with incomplete profiles
     */
    @Query("SELECT u FROM User u WHERE " +
            "u.phoneMobile IS NULL OR u.phoneMobile = '' OR " +
            "u.department IS NULL OR u.department = '' OR " +
            "u.division IS NULL OR u.division = '' OR " +
            "u.designation IS NULL OR u.designation = ''")
    Page<User> findUsersWithIncompleteProfiles(Pageable pageable);

    /**
     * Find recently registered users
     */
    @Query("SELECT u FROM User u WHERE u.registrationDate >= :sinceDate ORDER BY u.registrationDate DESC")
    Page<User> findRecentlyRegisteredUsers(@Param("sinceDate") java.time.LocalDateTime sinceDate, Pageable pageable);
}