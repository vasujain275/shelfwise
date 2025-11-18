package in.dipr.library.services;

/**
 * Service for managing overdue book transactions.
 * This service handles checking and updating the status of transactions that have passed their due date.
 */
public interface OverdueTransactionService {

    /**
     * Check all active transactions and mark those that are overdue with OVERDUE status.
     * This method is typically called on application startup or as a scheduled task.
     *
     * @return The number of transactions marked as overdue.
     */
    int checkAndMarkOverdueTransactions();
}
