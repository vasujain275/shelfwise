package in.dipr.library.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardDTO {

    // Book Statistics
    private long totalBookCopies;
    private long totalUniqueBooks;
    private long availableBooks;
    private long issuedBooks;
    private long overdueBooks;
    private long lostBooks;
    private long damagedBooks;
    private long booksAddedLast7Days;

    // User Statistics
    private long totalUsers;
    private long activeUsers;
    private long inactiveUsers;
    private long bannedUsers;
    private long newUsersLast30Days;

    // Transaction Statistics
    private long transactionsLast7Days;
    private long transactionsLast30Days;

    // Data for Graphs
    private java.util.List<java.util.Map<String, Object>> bookIssuesLast7Days;
    private java.util.List<java.util.Map<String, Object>> bookReturnsLast7Days;
    private java.util.List<java.util.Map<String, Object>> overdueBooksBreakdown;
}
