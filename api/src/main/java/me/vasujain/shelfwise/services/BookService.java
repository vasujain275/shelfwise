// BookService.java
package me.vasujain.shelfwise.services;

import me.vasujain.shelfwise.dtos.BookCreateDTO;
import me.vasujain.shelfwise.dtos.BookUpdateDTO;
import me.vasujain.shelfwise.dtos.BookDTO;
import me.vasujain.shelfwise.models.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Service interface for managing books in the library system.
 * Handles book registration, updates, retrieval, and a unified search functionality.
 */
public interface BookService {

    /**
     * Registers a new book in the system.
     *
     * @param bookCreateDTO DTO containing the details of the book to be registered.
     * @return The registered BookDTO.
     */
    BookDTO registerBook(BookCreateDTO bookCreateDTO);

    /**
     * Registers a list of new books in the system.
     *
     * @param bookCreateDTOs List of DTOs containing the details of the books to be registered.
     * @return A map containing the number of books created and a list of failed accession numbers.
     */
    Map<String, Object> registerBulkBooks(List<BookCreateDTO> bookCreateDTOs);

    /**
     * Updates an existing book's details.
     *
     * @param id            The UUID of the book to update.
     * @param bookUpdateDTO DTO containing the updated details.
     * @return The updated BookDTO.
     * @throws BookNotFoundException if the book with the given ID is not found.
     */
    BookDTO updateBook(UUID id, BookUpdateDTO bookUpdateDTO);

    /**
     * Retrieves all books with pagination.
     *
     * @param pageable Pagination information.
     * @return A page of BookDTOs.
     */
    Page<BookDTO> getAllBooks(Pageable pageable);

    /**
     * Retrieves a single book by its ID.
     *
     * @param id The UUID of the book.
     * @return The BookDTO corresponding to the ID.
     * @throws BookNotFoundException if the book with the given ID is not found.
     */
    BookDTO getBook(UUID id);

    /**
     * Searches for books based on a query string across multiple fields.
     *
     * @param query    The search string.
     * @param pageable Pagination information.
     * @return A page of matching BookDTOs.
     */
    Page<BookDTO> search(String query, Pageable pageable);

    /**
     * Soft deletes a book by marking it as unavailable.
     * @param id The UUID of the book to delete.
     */
    void deleteBook(UUID id);
}