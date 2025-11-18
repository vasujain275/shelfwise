package in.dipr.library.services;

import in.dipr.library.dtos.*;
import in.dipr.library.exceptions.BookNotFoundException;
import in.dipr.library.exceptions.UserNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

/**
 * Service interface for managing book transactions in the library system.
 * Handles issuing, returning, renewing, and tracking book loans.
 */
public interface BookTransactionService {

    /**
     * Issues a book to a user.
     *
     * @param issueDTO DTO containing book and user IDs for the transaction.
     * @return DTO of the created transaction.
     * @throws BookNotFoundException if the book is not found or unavailable.
     * @throws UserNotFoundException if the user is not found or cannot borrow.
     */
    BookTransactionDTO issueBook(BookIssueDTO issueDTO);

    /**
     * Returns a borrowed book.
     *
     * @param returnDTO DTO containing the transaction ID to be returned.
     * @return DTO of the updated transaction.
     * @throws BookNotFoundException if the transaction is not found.
     */
    BookTransactionDTO returnBook(BookReturnDTO returnDTO);

    /**
     * Renews a book loan for an extended period.
     *
     * @param renewDTO DTO containing the transaction ID and new due date.
     * @return DTO of the updated transaction.
     * @throws BookNotFoundException if the transaction is not found or cannot be renewed.
     */
    BookTransactionDTO renewBook(BookRenewDTO renewDTO);

    /**
     * Retrieves a transaction by its unique ID.
     *
     * @param transactionId The ID of the transaction.
     * @return DTO of the transaction.
     */
    BookTransactionDTO getTransactionById(UUID transactionId);

    /**
     * Retrieves all transactions with pagination.
     *
     * @param pageable Pagination parameters.
     * @return A page of transaction DTOs.
     */
    Page<BookTransactionDTO> getAllTransactions(Pageable pageable);

    /**
     * Searches for transactions based on specified criteria.
     *
     * @param searchDTO DTO with search parameters.
     * @param pageable  Pagination parameters.
     * @return A page of matching transaction DTOs.
     */
    Page<BookTransactionDTO> search(String query, Pageable pageable);

    /**
     * Retrieves all transactions for a specific book.
     *
     * @param bookId   The ID of the book.
     * @param pageable Pagination parameters.
     * @return A page of transaction DTOs for the book.
     */
    Page<BookTransactionDTO> getTransactionsByBookId(UUID bookId, Pageable pageable);

    /**
     * Retrieves all transactions for a specific user.
     *
     * @param userId   The ID of the user.
     * @param pageable Pagination parameters.
     * @return A page of transaction DTOs for the user.
     */
    Page<BookTransactionDTO> getTransactionsByUserId(UUID userId, Pageable pageable);

    /**
     * Retrieves all overdue transactions.
     *
     * @param pageable Pagination parameters.
     * @return A page of overdue transaction DTOs.
     */
    Page<BookTransactionDTO> getOverdueTransactions(Pageable pageable);

    /**
     * Retrieves the complete transaction history for a user.
     *
     * @param userId The ID of the user.
     * @return A list of all transaction DTOs for the user.
     */
    List<BookTransactionDTO> getUserTransactionHistory(UUID userId);

    /**
     * Checks if a specific book is currently issued to a specific user.
     *
     * @param bookId The ID of the book.
     * @param userId The ID of the user.
     * @return True if the book is currently issued to the user, false otherwise.
     */
    boolean isBookIssuedToUser(UUID bookId, UUID userId);

    /**
     * Counts the number of active borrowed books for a specific user.
     *
     * @param userId The ID of the user.
     * @return The total count of active borrowed books.
     */
    long getActiveBorrowsCount(UUID userId);

	Page<BookTransactionDTO> getActiveTransactions(Pageable pageable);

	Page<BookTransactionDTO> getActiveTransactionsByUserId(UUID userId, Pageable pageable);

	DataImportResultDTO issueBooks(List<BookIssueDTO> issueDTOs);

	DataImportResultDTO issueBooks(List<BookIssueDTO> issueDTOs, boolean isImport);
}
