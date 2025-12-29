package me.vasujain.shelfwise.controllers;

import me.vasujain.shelfwise.dtos.*;
import me.vasujain.shelfwise.response.CustomApiResponse;
import me.vasujain.shelfwise.response.ResponseUtil;
import me.vasujain.shelfwise.services.BookTransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Transactions", description = "Endpoints for managing book transactions")
public class BookTransactionController {

    private final BookTransactionService transactionService;

    @PostMapping("/issue")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "Issue a book", description = "Issues a book to a user and creates a new transaction.")
    @ApiResponse(responseCode = "201", description = "Book issued successfully")
    @ApiResponse(responseCode = "400", description = "Invalid transaction data")
    public ResponseEntity<CustomApiResponse<BookTransactionDTO>> issueBook(@Valid @RequestBody BookIssueDTO issueDTO) {
        log.info("Issuing book ID: {} to user ID: {}", issueDTO.getBookId(), issueDTO.getUserId());
        BookTransactionDTO transaction = transactionService.issueBook(issueDTO);
        return ResponseUtil.created(transaction, "Book issued successfully");
    }

    @PostMapping("/return")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "Return a book", description = "Marks a book as returned and updates the transaction.")
    @ApiResponse(responseCode = "200", description = "Book returned successfully")
    @ApiResponse(responseCode = "400", description = "Invalid return data")
    public ResponseEntity<CustomApiResponse<BookTransactionDTO>> returnBook(@Valid @RequestBody BookReturnDTO returnDTO) {
        log.info("Returning book for transaction ID: {}", returnDTO.getTransactionId());
        BookTransactionDTO transaction = transactionService.returnBook(returnDTO);
        return ResponseUtil.ok(transaction, "Book returned successfully");
    }

    @PostMapping("/renew")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "Renew a book", description = "Renews an existing book transaction, extending the due date.")
    @ApiResponse(responseCode = "200", description = "Book renewed successfully")
    @ApiResponse(responseCode = "400", description = "Invalid renewal data")
    public ResponseEntity<CustomApiResponse<BookTransactionDTO>> renewBook(@Valid @RequestBody BookRenewDTO renewDTO) {
        log.info("Renewing book for transaction ID: {}", renewDTO.getTransactionId());
        BookTransactionDTO transaction = transactionService.renewBook(renewDTO);
        return ResponseUtil.ok(transaction, "Book renewed successfully");
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "Get transaction by ID", description = "Retrieves a single book transaction by its unique ID.")
    @ApiResponse(responseCode = "200", description = "Transaction found")
    @ApiResponse(responseCode = "404", description = "Transaction not found")
    public ResponseEntity<CustomApiResponse<BookTransactionDTO>> getTransactionById(@PathVariable UUID id) {
        log.debug("Fetching transaction with ID: {}", id);
        BookTransactionDTO transaction = transactionService.getTransactionById(id);
        return ResponseUtil.ok(transaction);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "Get all transactions", description = "Retrieves a paginated list of all book transactions.")
    @ApiResponse(responseCode = "200", description = "Transactions retrieved successfully")
    public ResponseEntity<CustomApiResponse<List<BookTransactionDTO>>> getAllTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "issueDate") String sortBy,
            @RequestParam(defaultValue = "DESC") Sort.Direction sortDir) {

        log.debug("Fetching all transactions with pagination");
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDir, sortBy));
        Page<BookTransactionDTO> result = transactionService.getAllTransactions(pageable);
        return ResponseUtil.okPage(result);
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "Search transactions", description = "Searches for book transactions based on a query string.")
    @ApiResponse(responseCode = "200", description = "Transactions found")
    public ResponseEntity<CustomApiResponse<List<BookTransactionDTO>>> search(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "issueDate") String sortBy,
            @RequestParam(defaultValue = "DESC") Sort.Direction sortDir) {
        log.debug("Searching transactions with query: '{}'", query);
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDir, sortBy));
        Page<BookTransactionDTO> result = transactionService.search(query, pageable);
        return ResponseUtil.okPage(result);
    }

	@GetMapping("/active")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "Get active transactions", description = "Retrieves a paginated list of all active book transactions.")
    @ApiResponse(responseCode = "200", description = "Active transactions retrieved successfully")
    public ResponseEntity<CustomApiResponse<List<BookTransactionDTO>>> getActiveTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "issueDate") String sortBy,
            @RequestParam(defaultValue = "DESC") Sort.Direction sortDir) {

        log.debug("Fetching active transactions with pagination");
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDir, sortBy));
        Page<BookTransactionDTO> result = transactionService.getActiveTransactions(pageable);
        return ResponseUtil.okPage(result);
    }

    @GetMapping("/user/{userId}/active")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') or (hasRole('MEMBER') and #userId == authentication.principal.id)")
    @Operation(summary = "Get active transactions by user ID", description = "Retrieves a paginated list of active transactions for a specific user.")
    @ApiResponse(responseCode = "200", description = "Active transactions retrieved successfully")
    public ResponseEntity<CustomApiResponse<List<BookTransactionDTO>>> getActiveTransactionsByUserId(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        log.debug("Fetching active transactions for user ID: {}", userId);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "issueDate"));
        Page<BookTransactionDTO> result = transactionService.getActiveTransactionsByUserId(userId, pageable);
        return ResponseUtil.okPage(result);
    }

    @GetMapping("/book/{bookId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "Get transactions by book ID", description = "Retrieves a paginated list of transactions for a specific book.")
    @ApiResponse(responseCode = "200", description = "Transactions retrieved successfully")
    public ResponseEntity<CustomApiResponse<List<BookTransactionDTO>>> getTransactionsByBookId(
            @PathVariable UUID bookId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        log.debug("Fetching transactions for book ID: {}", bookId);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "issueDate"));
        Page<BookTransactionDTO> result = transactionService.getTransactionsByBookId(bookId, pageable);
        return ResponseUtil.okPage(result);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') or (hasRole('MEMBER') and #userId == authentication.principal.id)")
    @Operation(summary = "Get transactions by user ID", description = "Retrieves a paginated list of transactions for a specific user.")
    @ApiResponse(responseCode = "200", description = "Transactions retrieved successfully")
    public ResponseEntity<CustomApiResponse<List<BookTransactionDTO>>> getTransactionsByUserId(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        log.debug("Fetching transactions for user ID: {}", userId);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "issueDate"));
        Page<BookTransactionDTO> result = transactionService.getTransactionsByUserId(userId, pageable);
        return ResponseUtil.okPage(result);
    }

    @GetMapping("/overdue")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "Get overdue transactions", description = "Retrieves a paginated list of all overdue book transactions.")
    @ApiResponse(responseCode = "200", description = "Overdue transactions retrieved successfully")
    public ResponseEntity<CustomApiResponse<List<BookTransactionDTO>>> getOverdueTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        log.debug("Fetching overdue transactions");
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "dueDate"));
        Page<BookTransactionDTO> result = transactionService.getOverdueTransactions(pageable);
        return ResponseUtil.okPage(result);
    }

    @GetMapping("/user/{userId}/history")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') or (hasRole('MEMBER') and #userId == authentication.principal.id)")
    @Operation(summary = "Get user transaction history", description = "Retrieves the complete transaction history for a specific user.")
    @ApiResponse(responseCode = "200", description = "Transaction history retrieved successfully")
    public ResponseEntity<CustomApiResponse<List<BookTransactionDTO>>> getUserTransactionHistory(@PathVariable UUID userId) {
        log.debug("Fetching transaction history for user ID: {}", userId);
        List<BookTransactionDTO> history = transactionService.getUserTransactionHistory(userId);
        return ResponseUtil.ok(history);
    }

    @GetMapping("/book/{bookId}/user/{userId}/is-issued")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') or (hasRole('MEMBER') and #userId == authentication.principal.id)")
    @Operation(summary = "Check if book is issued to user", description = "Checks if a specific book is currently issued to a specific user.")
    @ApiResponse(responseCode = "200", description = "Check successful")
    public ResponseEntity<CustomApiResponse<Boolean>> isBookIssuedToUser(@PathVariable UUID bookId, @PathVariable UUID userId) {
        log.debug("Checking if book ID: {} is issued to user ID: {}", bookId, userId);
        boolean isIssued = transactionService.isBookIssuedToUser(bookId, userId);
        return ResponseUtil.ok(isIssued);
    }

    @GetMapping("/user/{userId}/active-borrows")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') or (hasRole('MEMBER') and #userId == authentication.principal.id)")
    @Operation(summary = "Get active borrows count for user", description = "Retrieves the count of active book borrows for a specific user.")
    @ApiResponse(responseCode = "200", description = "Active borrows count retrieved successfully")
    public ResponseEntity<CustomApiResponse<Long>> getActiveBorrowsCount(@PathVariable UUID userId) {
        log.debug("Fetching active borrows count for user ID: {}", userId);
        long activeBorrows = transactionService.getActiveBorrowsCount(userId);
        return ResponseUtil.ok(activeBorrows);
    }
}
