package in.dipr.library.services.impl;

import in.dipr.library.dtos.AdminDashboardDTO;
import in.dipr.library.dtos.MemberDashboardDTO;
import in.dipr.library.enums.BookStatus;
import in.dipr.library.enums.TransactionStatus;
import in.dipr.library.enums.UserStatus;
import in.dipr.library.mapper.BookTransactionMapper;
import in.dipr.library.models.DashboardStats;
import in.dipr.library.models.User;
import in.dipr.library.repositories.BookRepository;
import in.dipr.library.repositories.BookTransactionRepository;
import in.dipr.library.repositories.DashboardStatsRepository;
import in.dipr.library.repositories.UserRepository;
import in.dipr.library.services.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardServiceImpl implements DashboardService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final BookTransactionRepository bookTransactionRepository;
    private final DashboardStatsRepository dashboardStatsRepository;
    private final BookTransactionMapper bookTransactionMapper;

    @Override
    public AdminDashboardDTO getAdminDashboard() {
        DashboardStats stats = dashboardStatsRepository.findAll().stream().findFirst().orElse(new DashboardStats());
        return AdminDashboardDTO.builder()
                .totalBookCopies(stats.getTotalBookCopies())
                .totalUniqueBooks(stats.getTotalUniqueBooks())
                .availableBooks(stats.getAvailableBooks())
                .issuedBooks(stats.getIssuedBooks())
                .overdueBooks(stats.getOverdueBooks())
                .lostBooks(stats.getLostBooks())
                .damagedBooks(stats.getDamagedBooks())
                .booksAddedLast7Days(stats.getBooksAddedLast7Days())
                .totalUsers(stats.getTotalUsers())
                .activeUsers(stats.getActiveUsers())
                .inactiveUsers(stats.getInactiveUsers())
                .bannedUsers(stats.getBannedUsers())
                .newUsersLast30Days(stats.getNewUsersLast30Days())
                .transactionsLast7Days(stats.getTransactionsLast7Days())
                .transactionsLast30Days(stats.getTransactionsLast30Days())
                .bookIssuesLast7Days(bookTransactionRepository.countIssuesByDay(LocalDateTime.now().minusDays(7)))
                .bookReturnsLast7Days(bookTransactionRepository.countReturnsByDay(LocalDateTime.now().minusDays(7)))
                .overdueBooksBreakdown(bookTransactionRepository.countOverdueBooks())
                .build();
    }

    @Override
    public MemberDashboardDTO getMemberDashboard(User user) {
        long borrowedBooksCount = bookTransactionRepository.countByUserAndStatus(user, TransactionStatus.ACTIVE);
        long overdueBooksCount = bookTransactionRepository.countByUserAndStatusAndDueDateBefore(user, TransactionStatus.OVERDUE, LocalDateTime.now());
        return MemberDashboardDTO.builder()
                .borrowedBooksCount(borrowedBooksCount)
                .overdueBooksCount(overdueBooksCount)
                .overdueBooks(bookTransactionMapper.toDtoList(bookTransactionRepository.findByUserAndStatusAndDueDateBefore(user, TransactionStatus.OVERDUE, LocalDateTime.now())))
                .build();
    }

    @Override
    @Scheduled(cron = "0 0 * * * *") // Runs every hour
    public void updateDashboardStats() {
        log.info("Updating dashboard stats...");

        long totalBookCopies = bookRepository.count();
        long totalUniqueBooks = bookRepository.countDistinctByIsbn();
        long availableBooks = bookRepository.countByBookStatus(BookStatus.AVAILABLE);
        long issuedBooks = bookRepository.countByBookStatus(BookStatus.ISSUED);
        long overdueBooks = bookTransactionRepository.countOverdueTransactionsByStatusAndDueDateBefore(TransactionStatus.OVERDUE, LocalDateTime.now());
        long lostBooks = bookRepository.countByBookStatus(BookStatus.LOST);
        long damagedBooks = bookRepository.countByBookStatus(BookStatus.DAMAGED);
        long booksAddedLast7Days = bookRepository.countByCreatedAtAfter(LocalDateTime.now().minusDays(7));

        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByUserStatus(UserStatus.ACTIVE);
        long inactiveUsers = userRepository.countByUserStatus(UserStatus.INACTIVE);
        long bannedUsers = userRepository.countByUserStatus(UserStatus.SUSPENDED);
        long newUsersLast30Days = userRepository.countByCreatedAtAfter(LocalDateTime.now().minusDays(30));

        long transactionsLast7Days = bookTransactionRepository.countByCreatedAtAfter(LocalDateTime.now().minusDays(7));
        long transactionsLast30Days = bookTransactionRepository.countByCreatedAtAfter(LocalDateTime.now().minusDays(30));

        DashboardStats stats = dashboardStatsRepository.findAll().stream().findFirst().orElse(new DashboardStats());
        stats.setTotalBookCopies(totalBookCopies);
        stats.setTotalUniqueBooks(totalUniqueBooks);
        stats.setAvailableBooks(availableBooks);
        stats.setIssuedBooks(issuedBooks);
        stats.setOverdueBooks(overdueBooks);
        stats.setLostBooks(lostBooks);
        stats.setDamagedBooks(damagedBooks);
        stats.setBooksAddedLast7Days(booksAddedLast7Days);
        stats.setTotalUsers(totalUsers);
        stats.setActiveUsers(activeUsers);
        stats.setInactiveUsers(inactiveUsers);
        stats.setBannedUsers(bannedUsers);
        stats.setNewUsersLast30Days(newUsersLast30Days);
        stats.setTransactionsLast7Days(transactionsLast7Days);
        stats.setTransactionsLast30Days(transactionsLast30Days);

        dashboardStatsRepository.save(stats);
        log.info("Dashboard stats updated.");
    }
}
