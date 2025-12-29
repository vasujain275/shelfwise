package me.vasujain.shelfwise.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * Entity to store pre-calculated dashboard statistics.
 * This table is expected to have only one row that is periodically updated by a scheduled job.
 */
@Entity
@Table(name = "dashboard_stats")
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class DashboardStats extends BaseEntity {

    // Book Statistics
    @Column(nullable = false)
    private long totalBookCopies;

    @Column(nullable = false)
    private long totalUniqueBooks;

    @Column(nullable = false)
    private long availableBooks;

    @Column(nullable = false)
    private long issuedBooks;

    @Column(nullable = false)
    private long overdueBooks;

    @Column(nullable = false)
    private long lostBooks;

    @Column(nullable = false)
    private long damagedBooks;

    @Column(nullable = false)
    private long booksAddedLast7Days;

    // User Statistics
    @Column(nullable = false)
    private long totalUsers;

    @Column(nullable = false)
    private long activeUsers;

    @Column(nullable = false)
    private long inactiveUsers;

    @Column(nullable = false)
    private long bannedUsers;

    @Column(nullable = false)
    private long newUsersLast30Days;

    // Transaction Statistics
    @Column(nullable = false)
    private long transactionsLast7Days;

    @Column(nullable = false)
    private long transactionsLast30Days;
}
