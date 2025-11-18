package in.dipr.library.models;

import in.dipr.library.enums.TransactionStatus;
import in.dipr.library.enums.TransactionType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "book_transactions", indexes = {
        @Index(name = "idx_book_user", columnList = "book_id, user_id"),
        @Index(name = "idx_status", columnList = "status"),
        @Index(name = "idx_issue_date", columnList = "issueDate"),
        @Index(name = "idx_due_date", columnList = "dueDate"),
        @Index(name = "idx_active_transactions", columnList = "status, dueDate")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class BookTransaction extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false)
    private TransactionType transactionType;

    @Column(name = "issue_date", nullable = false)
    private LocalDateTime issueDate;

    @Column(name = "due_date", nullable = false)
    private LocalDateTime dueDate;

    @Column(name = "return_date")
    private LocalDateTime returnDate;

    @Column(name = "renewal_count")
	@lombok.Builder.Default
    private Integer renewalCount = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issued_by_user_id", nullable = false)
    private User issuedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "returned_to_user_id")
    private User returnedTo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
	@lombok.Builder.Default
    private TransactionStatus status = TransactionStatus.ACTIVE;

    @Column(name = "transaction_notes", columnDefinition = "TEXT")
    private String transactionNotes;
}