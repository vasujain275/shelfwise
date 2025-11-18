package in.dipr.library.services.impl;

import in.dipr.library.enums.TransactionStatus;
import in.dipr.library.models.BookTransaction;
import in.dipr.library.repositories.BookTransactionRepository;
import in.dipr.library.services.OverdueTransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Implementation of OverdueTransactionService.
 * Handles checking and updating overdue book transactions.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OverdueTransactionServiceImpl implements OverdueTransactionService {

    private final BookTransactionRepository transactionRepository;

    @Override
    @Transactional
    public int checkAndMarkOverdueTransactions() {
        log.info("Starting overdue transaction check...");

        LocalDateTime currentDateTime = LocalDateTime.now();

        // Find all active transactions that have passed their due date
        List<BookTransaction> overdueTransactions = transactionRepository
                .findByStatusAndDueDateBefore(TransactionStatus.ACTIVE, currentDateTime);

        if (overdueTransactions.isEmpty()) {
            log.info("No overdue transactions found.");
            return 0;
        }

        log.info("Found {} overdue transactions. Marking them as OVERDUE...", overdueTransactions.size());

        // Mark each transaction as OVERDUE
        overdueTransactions.forEach(transaction -> {
            transaction.setStatus(TransactionStatus.OVERDUE);
            log.debug("Marked transaction ID {} as OVERDUE (Book: {}, User: {}, Due: {})",
                    transaction.getId(),
                    transaction.getBook().getAccessionNumber(),
                    transaction.getUser().getEmployeeId(),
                    transaction.getDueDate());
        });

        // Save all updated transactions in batch
        transactionRepository.saveAll(overdueTransactions);

        log.info("Successfully marked {} transactions as OVERDUE.", overdueTransactions.size());
        return overdueTransactions.size();
    }
}
