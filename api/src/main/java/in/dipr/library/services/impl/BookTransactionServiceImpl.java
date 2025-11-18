package in.dipr.library.services.impl;

import in.dipr.library.dtos.*;
import in.dipr.library.enums.BookStatus;
import in.dipr.library.enums.TransactionStatus;
import in.dipr.library.enums.TransactionType;
import in.dipr.library.exceptions.BookAlreadyIssuedException;
import in.dipr.library.exceptions.BookIsReferenceOnlyException;
import in.dipr.library.exceptions.BookNotFoundException;
import in.dipr.library.exceptions.BookNotIssuedException;
import in.dipr.library.exceptions.UserNotFoundException;
import in.dipr.library.models.Book;
import in.dipr.library.models.BookTransaction;
import in.dipr.library.models.User;
import in.dipr.library.repositories.BookRepository;
import in.dipr.library.repositories.BookTransactionRepository;
import in.dipr.library.repositories.UserRepository;
import in.dipr.library.services.BookTransactionService;
import in.dipr.library.mapper.BookTransactionMapper;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class BookTransactionServiceImpl implements BookTransactionService {

    private final BookTransactionRepository transactionRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final BookTransactionMapper transactionMapper;

    @Override
    public BookTransactionDTO issueBook(BookIssueDTO issueDTO) throws BookNotFoundException, UserNotFoundException {
        log.info("Attempting to issue book ID: {} to user ID: {}", issueDTO.getBookId(), issueDTO.getUserId());

        Book book = getBookById(issueDTO.getBookId());
        User user = getUserById(issueDTO.getUserId());
        User issuedBy = getCurrentUser();

        validateBookAvailabilityForIssue(book, user);

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        user.setBooksIssued(user.getBooksIssued() + 1);

        if (book.getAvailableCopies() == 0) {
            book.setBookStatus(BookStatus.ISSUED);
        }

        BookTransaction transaction = BookTransaction.builder()
                .book(book)
                .user(user)
                .transactionType(TransactionType.ISSUE)
                .issueDate(issueDTO.getIssueDate().atStartOfDay())
                .dueDate(issueDTO.getDueDate().atStartOfDay())
                .status(TransactionStatus.ACTIVE)
                .issuedBy(issuedBy)
                .transactionNotes(issueDTO.getTransactionNotes())
                .build();

        bookRepository.save(book);
        userRepository.save(user);
        BookTransaction savedTransaction = transactionRepository.save(transaction);

        log.info("Successfully issued book ID: {} to user ID: {}. Transaction ID: {}",
                book.getId(), user.getId(), savedTransaction.getId());

        return transactionMapper.toDto(savedTransaction);
    }

    @Override
    public BookTransactionDTO returnBook(BookReturnDTO returnDTO) throws BookNotFoundException {
        log.info("Attempting to return book for transaction ID: {}", returnDTO.getTransactionId());

        BookTransaction transaction = getTransactionEntityById(returnDTO.getTransactionId());
        User returnedTo = getCurrentUser();

        validateTransactionForReturn(transaction);

        Book book = transaction.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        if (book.getBookStatus() == BookStatus.ISSUED) {
            book.setBookStatus(BookStatus.AVAILABLE);
        }

        transaction.setStatus(TransactionStatus.COMPLETED);
        transaction.setReturnDate(LocalDateTime.now());
        transaction.setReturnedTo(returnedTo);
        if (StringUtils.hasText(returnDTO.getTransactionNotes())) {
            transaction.setTransactionNotes(returnDTO.getTransactionNotes());
        }

        bookRepository.save(book);
        BookTransaction updatedTransaction = transactionRepository.save(transaction);

        log.info("Successfully returned book for transaction ID: {}", updatedTransaction.getId());

        return transactionMapper.toDto(updatedTransaction);
    }

    @Override
    public BookTransactionDTO renewBook(BookRenewDTO renewDTO) throws BookNotFoundException {
        log.info("Attempting to renew book for transaction ID: {}", renewDTO.getTransactionId());

        BookTransaction transaction = getTransactionEntityById(renewDTO.getTransactionId());

        validateTransactionForRenewal(transaction);

        transaction.setDueDate(renewDTO.getNewDueDate().atStartOfDay());
        transaction.setRenewalCount(transaction.getRenewalCount() != null ? transaction.getRenewalCount() + 1 : 1);
        if (StringUtils.hasText(renewDTO.getTransactionNotes())) {
            transaction.setTransactionNotes(renewDTO.getTransactionNotes());
        }

        BookTransaction updatedTransaction = transactionRepository.save(transaction);

        log.info("Successfully renewed book for transaction ID: {}", updatedTransaction.getId());

        return transactionMapper.toDto(updatedTransaction);
    }

    @Override
    @Transactional(readOnly = true)
    public BookTransactionDTO getTransactionById(UUID transactionId) {
        return transactionMapper.toDto(getTransactionEntityById(transactionId));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookTransactionDTO> getAllTransactions(Pageable pageable) {
        return transactionRepository.findAll(pageable).map(transactionMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookTransactionDTO> search(String query, Pageable pageable) {
        Specification<BookTransaction> spec = (root, q, cb) -> {
            if (!StringUtils.hasText(query)) {
                return cb.conjunction();
            }

            String lowercaseQuery = query.toLowerCase();

            Predicate bookTitlePredicate = cb.like(cb.lower(root.get("book").get("title")), "%" + lowercaseQuery + "%");
            Predicate bookAccPredicate = cb.like(cb.lower(root.get("book").get("accessionNumber")), "%" + lowercaseQuery + "%");
            Predicate userFullNamePredicate = cb.like(cb.lower(root.get("user").get("fullName")), "%" + lowercaseQuery + "%");
            Predicate userEmpPredicate = cb.like(cb.lower(root.get("user").get("employeeId")), "%" + lowercaseQuery + "%");

            return cb.or(bookTitlePredicate, userFullNamePredicate, bookAccPredicate, userEmpPredicate);
        };

        return transactionRepository.findAll(spec, pageable).map(transactionMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookTransactionDTO> getTransactionsByBookId(UUID bookId, Pageable pageable) {
        return transactionRepository.findByBookId(bookId, pageable).map(transactionMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookTransactionDTO> getTransactionsByUserId(UUID userId, Pageable pageable) {
        return transactionRepository.findByUserId(userId, pageable).map(transactionMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookTransactionDTO> getOverdueTransactions(Pageable pageable) {
        return transactionRepository.findPageByStatusAndDueDateBefore(TransactionStatus.ACTIVE, LocalDateTime.now(), pageable)
                .map(transactionMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookTransactionDTO> getUserTransactionHistory(UUID userId) {
        return transactionRepository.findByUserIdOrderByIssueDateDesc(userId).stream()
                .map(transactionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isBookIssuedToUser(UUID bookId, UUID userId) {
        return transactionRepository.existsByBookIdAndUserIdAndStatus(bookId, userId, TransactionStatus.ACTIVE);
    }

    @Override
    @Transactional(readOnly = true)
    public long getActiveBorrowsCount(UUID userId) {
        User user = getUserById(userId);
        return transactionRepository.countByUserAndStatus(user, TransactionStatus.ACTIVE);
    }

	@Override
    @Transactional(readOnly = true)
    public Page<BookTransactionDTO> getActiveTransactions(Pageable pageable) {
        return transactionRepository.findByStatus(TransactionStatus.ACTIVE, pageable).map(transactionMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookTransactionDTO> getActiveTransactionsByUserId(UUID userId, Pageable pageable) {
        return transactionRepository.findByUserIdAndStatus(userId, TransactionStatus.ACTIVE, pageable).map(transactionMapper::toDto);
    }

    // ===============================
    // PRIVATE HELPER METHODS
    // ===============================

    private BookTransaction getTransactionEntityById(UUID transactionId) {
        return transactionRepository.findById(transactionId)
                .orElseThrow(() -> new BookNotFoundException("Transaction not found with ID: " + transactionId));
    }

    private Book getBookById(UUID bookId) {
        return bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException("Book not found with ID: " + bookId));
    }

    private User getUserById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmployeeId(username)
                .orElseThrow(() -> new UserNotFoundException("Authenticated user not found in database"));
    }

    private void validateBookAvailabilityForIssue(Book book, User user) {
        if (Boolean.TRUE.equals(book.getIsReferenceOnly())) {
            throw new BookIsReferenceOnlyException("Book with accession number " + book.getAccessionNumber() + " is for reference only and cannot be issued.");
        }
        if (book.getAvailableCopies() <= 0) {
            throw new BookAlreadyIssuedException("No available copies for book: " + book.getTitle());
        }
        if (book.getBookStatus() != BookStatus.AVAILABLE) {
            throw new BookAlreadyIssuedException("Book is not in an available state. Current state: " + book.getBookStatus());
        }
    }


    private void validateTransactionForReturn(BookTransaction transaction) {
        if (transaction.getStatus() != TransactionStatus.ACTIVE) {
            throw new BookNotIssuedException("Transaction is not active and cannot be returned. Current status: " + transaction.getStatus());
        }
    }

    private void validateTransactionForRenewal(BookTransaction transaction) {
        if (transaction.getStatus() != TransactionStatus.ACTIVE) {
            throw new BookNotIssuedException("Transaction is not active and cannot be renewed. Current status: " + transaction.getStatus());
        }
    }

	@Override
	public DataImportResultDTO issueBooks(List<BookIssueDTO> issueDTOs) {
		return issueBooks(issueDTOs, false);
	}

	@Override
	public DataImportResultDTO issueBooks(List<BookIssueDTO> issueDTOs, boolean isImport) {
		int successCount = 0;
		List<String> failedIdentifiers = new ArrayList<>();
		List<BookTransaction> transactionsToSave = new ArrayList<>();
		List<Book> booksToSave = new ArrayList<>();
		List<User> usersToSave = new ArrayList<>();

		for (BookIssueDTO issueDTO : issueDTOs) {
			try {
				log.info("Attempting to issue book ID: {} to user ID: {}", issueDTO.getBookId(), issueDTO.getUserId());

				Book book = getBookById(issueDTO.getBookId());
				User user = getUserById(issueDTO.getUserId());
				User issuedBy = getCurrentUser();

				if (!isImport) {
					validateBookAvailabilityForIssue(book, user);
				}

				book.setAvailableCopies(book.getAvailableCopies() - 1);
				user.setBooksIssued(user.getBooksIssued() + 1);

				if (book.getAvailableCopies() == 0) {
					book.setBookStatus(BookStatus.ISSUED);
				}

				BookTransaction transaction = BookTransaction.builder().book(book).user(user)
						.transactionType(TransactionType.ISSUE).issueDate(issueDTO.getIssueDate().atStartOfDay())
						.dueDate(issueDTO.getDueDate().atStartOfDay()).status(TransactionStatus.ACTIVE)
						.issuedBy(issuedBy).transactionNotes(issueDTO.getTransactionNotes()).build();

				transactionsToSave.add(transaction);
				booksToSave.add(book);
				usersToSave.add(user);

				successCount++;
			} catch (Exception e) {
				log.error("Failed to issue book ID: {} to user ID: {}. Reason: {}", issueDTO.getBookId(),
						issueDTO.getUserId(), e.getMessage());
				failedIdentifiers.add(issueDTO.getBookId().toString());
			}
		}

		if (!transactionsToSave.isEmpty()) {
			bookRepository.saveAll(booksToSave);
			userRepository.saveAll(usersToSave);
			transactionRepository.saveAll(transactionsToSave);
		}

		return new DataImportResultDTO(successCount, failedIdentifiers.size(), failedIdentifiers,
				"Transaction import process completed.");
	}
}
