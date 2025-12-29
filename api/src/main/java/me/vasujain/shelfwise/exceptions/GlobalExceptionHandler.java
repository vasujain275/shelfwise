package me.vasujain.shelfwise.exceptions;


import me.vasujain.shelfwise.response.CustomApiResponse;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDate;
import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private final Logger logger;

    @Autowired
    public GlobalExceptionHandler(Logger logger) {
        this.logger = logger;
    }


    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<CustomApiResponse<Void>> handleResourceNotFoundException(ResourceNotFoundException ex) {
        logger.error("Resource not found: {}", ex.getMessage());

        CustomApiResponse<Void> response = CustomApiResponse.<Void>builder()
                .status(HttpStatus.NOT_FOUND)
                .message(ex.getMessage())
                .timestamp(LocalDate.from(LocalDateTime.now()))
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(BookNotFoundException.class)
    public ResponseEntity<CustomApiResponse<Void>> handleBookNotFoundException(BookNotFoundException ex) {
        logger.error("Book not found: {}", ex.getMessage());

        CustomApiResponse<Void> response = CustomApiResponse.<Void>builder()
                .status(HttpStatus.NOT_FOUND)
                .message(ex.getMessage())
                .timestamp(LocalDate.from(LocalDateTime.now()))
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<CustomApiResponse<Void>> handleUserNotFoundException(UserNotFoundException ex) {
        logger.error("User not found: {}", ex.getMessage());

        CustomApiResponse<Void> response = CustomApiResponse.<Void>builder()
                .status(HttpStatus.NOT_FOUND)
                .message(ex.getMessage())
                .timestamp(LocalDate.from(LocalDateTime.now()))
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<CustomApiResponse<Void>> handleInvalidTokenException(InvalidTokenException ex) {
        logger.error("Invalid token: {}", ex.getMessage());

        CustomApiResponse<Void> response = CustomApiResponse.<Void>builder()
                .status(HttpStatus.UNAUTHORIZED)
                .message(ex.getMessage())
                .timestamp(LocalDate.from(LocalDateTime.now()))
                .build();

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @ExceptionHandler(DuplicateEmployeeIdException.class)
    public ResponseEntity<CustomApiResponse<Void>> handleDuplicateEmployeeIdException(DuplicateEmployeeIdException ex) {
        logger.error("Duplicate employee ID: {}", ex.getMessage());

        CustomApiResponse<Void> response = CustomApiResponse.<Void>builder()
                .status(HttpStatus.CONFLICT)
                .message(ex.getMessage())
                .timestamp(LocalDate.from(LocalDateTime.now()))
                .build();

        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(DuplicateAccessionNumberException.class)
    public ResponseEntity<CustomApiResponse<Void>> handleDuplicateAccessionNumberException(DuplicateAccessionNumberException ex) {
        logger.error("Duplicate accession number: {}", ex.getMessage());

        CustomApiResponse<Void> response = CustomApiResponse.<Void>builder()
                .status(HttpStatus.CONFLICT)
                .message(ex.getMessage())
                .timestamp(LocalDate.from(LocalDateTime.now()))
                .build();

        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(DuplicateEmailException.class)
    public ResponseEntity<CustomApiResponse<Void>> handleDuplicateEmailException(DuplicateEmailException ex) {
        logger.error("Duplicate email: {}", ex.getMessage());

        CustomApiResponse<Void> response = CustomApiResponse.<Void>builder()
                .status(HttpStatus.CONFLICT)
                .message(ex.getMessage())
                .timestamp(LocalDate.from(LocalDateTime.now()))
                .build();

        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }


    @ExceptionHandler(BookAlreadyIssuedException.class)
    public ResponseEntity<CustomApiResponse<Void>> handleBookAlreadyIssuedException(BookAlreadyIssuedException ex) {
        logger.error("Book already issued: {}", ex.getMessage());

        CustomApiResponse<Void> response = CustomApiResponse.<Void>builder()
                .status(HttpStatus.CONFLICT)
                .message(ex.getMessage())
                .timestamp(LocalDate.from(LocalDateTime.now()))
                .build();

        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(BookIsReferenceOnlyException.class)
    public ResponseEntity<CustomApiResponse<Void>> handleBookIsReferenceOnlyException(BookIsReferenceOnlyException ex) {
        logger.error("Book is for reference only: {}", ex.getMessage());

        CustomApiResponse<Void> response = CustomApiResponse.<Void>builder()
                .status(HttpStatus.BAD_REQUEST)
                .message(ex.getMessage())
                .timestamp(LocalDate.from(LocalDateTime.now()))
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<CustomApiResponse<Void>> handleIllegalStateException(IllegalStateException ex) {
        logger.error("Illegal state: {}", ex.getMessage());

        CustomApiResponse<Void> response = CustomApiResponse.<Void>builder()
                .status(HttpStatus.CONFLICT)
                .message(ex.getMessage())
                .timestamp(LocalDate.from(LocalDateTime.now()))
                .build();

        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(BookNotIssuedException.class)
    public ResponseEntity<CustomApiResponse<Void>> handleBookNotIssuedException(BookNotIssuedException ex) {
        logger.error("Book not issued: {}", ex.getMessage());

        CustomApiResponse<Void> response = CustomApiResponse.<Void>builder()
                .status(HttpStatus.CONFLICT)
                .message(ex.getMessage())
                .timestamp(LocalDate.from(LocalDateTime.now()))
                .build();

        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<CustomApiResponse<Void>> handleIllegalArgumentException(IllegalArgumentException ex) {
        logger.error("Illegal argument: {}", ex.getMessage());

        CustomApiResponse<Void> response = CustomApiResponse.<Void>builder()
                .status(HttpStatus.BAD_REQUEST)
                .message(ex.getMessage())
                .timestamp(LocalDate.from(LocalDateTime.now()))
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(AuthorizationDeniedException.class)
    public ResponseEntity<CustomApiResponse<Void>> handleAuthorizationDeniedException(AuthorizationDeniedException ex) {
        logger.error("Authorization denied: {}", ex.getMessage());

        CustomApiResponse<Void> response = CustomApiResponse.<Void>builder()
                .status(HttpStatus.UNAUTHORIZED)
                .message("You are not authorized to perform this action.")
                .timestamp(LocalDate.from(LocalDateTime.now()))
                .build();

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<CustomApiResponse<Void>> handleRuntimeException(RuntimeException ex) {
        logger.error("Unhandled runtime exception", ex);

        CustomApiResponse<Void> response = CustomApiResponse.<Void>builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .message("An unexpected error occurred. Please contact support.")
                .timestamp(LocalDate.from(LocalDateTime.now()))
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<CustomApiResponse<Void>> handleGenericException(Exception ex) {
        logger.error("Unexpected error occurred", ex);

        CustomApiResponse<Void> response = CustomApiResponse.<Void>builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .message("An unexpected error occurred")
                .timestamp(LocalDate.from(LocalDateTime.now()))
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

}
