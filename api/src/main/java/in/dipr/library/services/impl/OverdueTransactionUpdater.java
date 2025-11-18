package in.dipr.library.services.impl;

import in.dipr.library.services.OverdueTransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * CommandLineRunner component that runs on application startup.
 * Checks all active transactions and marks overdue ones with OVERDUE status.
 * This ensures that transaction statuses are accurate when the application starts.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class OverdueTransactionUpdater implements CommandLineRunner {

    private final OverdueTransactionService overdueTransactionService;

    @Override
    public void run(String... args) throws Exception {
        log.info("Checking for overdue transactions on application startup...");

        try {
            int overdueCount = overdueTransactionService.checkAndMarkOverdueTransactions();

            if (overdueCount > 0) {
                log.info("Application startup: {} transaction(s) marked as OVERDUE.", overdueCount);
            } else {
                log.info("Application startup: No overdue transactions found.");
            }
        } catch (Exception e) {
            log.error("Error occurred while checking overdue transactions on startup: {}", e.getMessage(), e);
            // Don't throw the exception to allow application to start even if this fails
        }
    }
}
