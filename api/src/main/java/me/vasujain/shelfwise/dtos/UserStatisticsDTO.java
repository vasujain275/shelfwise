package me.vasujain.shelfwise.dtos;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserStatisticsDTO {
    private long totalUsers;
    private long activeUsers;
    private long suspendedUsers;
    private long inactiveUsers;
    private long usersWithExpiringAccounts;
    private long usersByRole;
    private long totalBorrowedBooks;
    private double averageBooksPerUser;
}