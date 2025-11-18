package in.dipr.library.repositories;

import in.dipr.library.enums.TransactionStatus;
import in.dipr.library.models.Book;
import in.dipr.library.models.BookTransaction;
import in.dipr.library.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface BookTransactionRepository extends JpaRepository<BookTransaction, UUID>, JpaSpecificationExecutor<BookTransaction> {

    long countByUserAndStatus(User user, TransactionStatus status);

    long countByUserAndStatusAndDueDateBefore(User user, TransactionStatus status, LocalDateTime date);

    List<BookTransaction> findByUserAndStatusAndDueDateBefore(User user, TransactionStatus status, LocalDateTime date);

    List<BookTransaction> findByStatusAndDueDateBefore(TransactionStatus status, LocalDateTime date);

    @Query("SELECT COUNT(bt) FROM BookTransaction bt WHERE bt.status = :status AND bt.dueDate < :date")
    long countOverdueTransactionsByStatusAndDueDateBefore(@Param("status") TransactionStatus status, @Param("date") LocalDateTime date);

    long countByCreatedAtAfter(LocalDateTime date);

    @Query("SELECT bt.book FROM BookTransaction bt WHERE bt.status = 'ACTIVE' AND bt.dueDate < :currentDate")
    Page<Book> findOverdueBooks(@Param("currentDate") LocalDate currentDate, Pageable pageable);

    Page<BookTransaction> findByBookId(UUID bookId, Pageable pageable);

    Page<BookTransaction> findByUserId(UUID userId, Pageable pageable);

    Page<BookTransaction> findPageByStatusAndDueDateBefore(TransactionStatus status, LocalDateTime date, Pageable pageable);

    List<BookTransaction> findByUserIdOrderByIssueDateDesc(UUID userId);

    boolean existsByBookIdAndUserIdAndStatus(UUID bookId, UUID userId, TransactionStatus status);

	Page<BookTransaction> findByStatus(TransactionStatus status, Pageable pageable);

	Page<BookTransaction> findByUserIdAndStatus(UUID userId, TransactionStatus status, Pageable pageable);

    @Query(value = "SELECT DATE_FORMAT(bt.created_at, '%Y-%m-%d') as date, COUNT(bt.id) as count FROM book_transactions bt WHERE bt.transaction_type = 'ISSUE' AND bt.created_at >= :startDate GROUP BY date ORDER BY date", nativeQuery = true)
    List<java.util.Map<String, Object>> countIssuesByDay(@Param("startDate") LocalDateTime startDate);

    @Query(value = "SELECT DATE_FORMAT(bt.updated_at, '%Y-%m-%d') as date, COUNT(bt.id) as count FROM book_transactions bt WHERE bt.transaction_type = 'RETURN' AND bt.updated_at >= :startDate GROUP BY date ORDER BY date", nativeQuery = true)
    List<java.util.Map<String, Object>> countReturnsByDay(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT bt.book.title as title, COUNT(bt.id) as count FROM BookTransaction bt WHERE bt.status = 'OVERDUE' GROUP BY title")
    List<java.util.Map<String, Object>> countOverdueBooks();
}
