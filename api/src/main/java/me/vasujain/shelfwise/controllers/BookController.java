// BookController.java
package me.vasujain.shelfwise.controllers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import me.vasujain.shelfwise.dtos.BookCreateDTO;
import me.vasujain.shelfwise.dtos.BookDTO;
import me.vasujain.shelfwise.dtos.BookUpdateDTO;
import me.vasujain.shelfwise.response.CustomApiResponse;
import me.vasujain.shelfwise.response.ResponseUtil;
import me.vasujain.shelfwise.services.BookService;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Books", description = "Endpoints for managing books")
public class BookController {

    private final BookService bookService;
    private final ObjectMapper objectMapper;
    private static final String UPLOAD_DIR = "uploads";

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "Register a new book", description = "Registers a new book in the library system.")
    @ApiResponse(responseCode = "201", description = "Book registered successfully")
    @ApiResponse(responseCode = "400", description = "Invalid book data")
    public ResponseEntity<CustomApiResponse<BookDTO>> registerBook(@Valid @RequestBody BookCreateDTO bookCreateDTO) {
        log.info("Registering new book with title: {}", bookCreateDTO.getTitle());
        BookDTO createdBook = bookService.registerBook(bookCreateDTO);
        return ResponseUtil.created(createdBook, "Book registered successfully");
    }

    @PostMapping("/bulk")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "Register bulk books", description = "Registers multiple books by uploading a JSON file containing an array of book data.")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "A JSON file containing an array of BookCreateDTO objects.", required = true,
            content = @io.swagger.v3.oas.annotations.media.Content(mediaType = "multipart/form-data",
                    schema = @io.swagger.v3.oas.annotations.media.Schema(type = "string", format = "binary")))
    @ApiResponse(responseCode = "201", description = "Bulk book registration complete")
    @ApiResponse(responseCode = "400", description = "Invalid file or file format")
    public ResponseEntity<CustomApiResponse<Map<String, Object>>> registerBulkBooks(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseUtil.badRequest(null, "File is empty");
        }

        Path uploadPath = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();
        try {
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
        } catch (IOException e) {
            log.error("Could not create upload directory", e);
            return ResponseUtil.internalServerError(null, "Could not create upload directory");
        }

        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
            log.info("File uploaded successfully to: {}", filePath.toString());

            List<BookCreateDTO> bookCreateDTOs = objectMapper.readValue(filePath.toFile(), new TypeReference<List<BookCreateDTO>>() {});
            Map<String, Object> result = bookService.registerBulkBooks(bookCreateDTOs);

            int createdCount = (int) result.get("booksCreated");
            List<String> failedAccessionNumbers = (List<String>) result.get("failedAccessionNumbers");

            String message = String.format("Bulk book registration complete. %d books created.", createdCount);
            if (!failedAccessionNumbers.isEmpty()) {
                message += String.format(" %d books failed to upload.", failedAccessionNumbers.size());
            }

            return ResponseUtil.created(result, message);

        } catch (IOException e) {
            log.error("Failed to process uploaded file", e);
            return ResponseUtil.internalServerError(null, "Failed to process file");
        } finally {
            try {
                if (Files.exists(filePath)) {
                    Files.delete(filePath);
                    log.info("Deleted temporary file: {}", filePath.toString());
                }
            } catch (IOException e) {
                log.error("Could not delete temporary file: {}", filePath.toString(), e);
            }
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a book by ID", description = "Retrieves a book by its unique ID.")
    @ApiResponse(responseCode = "200", description = "Book found")
    @ApiResponse(responseCode = "404", description = "Book not found")
    public ResponseEntity<CustomApiResponse<BookDTO>> getBook(@PathVariable UUID id) {
        log.debug("Fetching book with ID: {}", id);
        BookDTO book = bookService.getBook(id);
        return ResponseUtil.ok(book);
    }

    @GetMapping
    @Operation(summary = "Get all books", description = "Retrieves a paginated list of all books.")
    @ApiResponse(responseCode = "200", description = "Books retrieved successfully")
    public ResponseEntity<CustomApiResponse<List<BookDTO>>> getAllBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "title") String sortBy,
            @RequestParam(defaultValue = "ASC") Sort.Direction sortDir) {

        log.debug("Fetching all books with pagination");
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDir, sortBy));
        Page<BookDTO> result = bookService.getAllBooks(pageable);
        return ResponseUtil.okPage(result);
    }

    /**
     * Unified search endpoint for books.
     * Searches against title, author, publisher, accession number, and keywords.
     */
    @GetMapping("/search")
    @Operation(summary = "Search for books", description = "Searches for books based on a query string.")
    @ApiResponse(responseCode = "200", description = "Books found")
    public ResponseEntity<CustomApiResponse<List<BookDTO>>> searchBooks(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "title") String sortBy,
            @RequestParam(defaultValue = "ASC") Sort.Direction sortDir) {
        log.debug("Searching books with query: '{}'", query);
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDir, sortBy));
        Page<BookDTO> result = bookService.search(query, pageable);
        return ResponseUtil.okPage(result);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "Update a book", description = "Updates an existing book's information.")
    @ApiResponse(responseCode = "200", description = "Book updated successfully")
    @ApiResponse(responseCode = "404", description = "Book not found")
    public ResponseEntity<CustomApiResponse<BookDTO>> updateBook(
            @PathVariable UUID id,
            @Valid @RequestBody BookUpdateDTO bookUpdateDTO) {

        log.info("Updating book with ID: {}", id);
        BookDTO updatedBook = bookService.updateBook(id, bookUpdateDTO);
        return ResponseUtil.ok(updatedBook, "Book updated successfully");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "Delete a book", description = "Soft-deletes a book from the system.")
    @ApiResponse(responseCode = "200", description = "Book soft-deleted successfully")
    @ApiResponse(responseCode = "404", description = "Book not found")
    public ResponseEntity<CustomApiResponse<Void>> deleteBook(@PathVariable UUID id) {
        log.info("Soft deleting book with ID: {}", id);
        bookService.deleteBook(id);
        return ResponseUtil.ok(null, "Book soft-deleted successfully");
    }
}