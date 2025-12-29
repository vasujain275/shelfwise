package me.vasujain.shelfwise.response;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class ResponseUtil {

    public static <T> ResponseEntity<CustomApiResponse<T>> ok(T data){
        CustomApiResponse<T> response = CustomApiResponse.<T>builder()
                .status(HttpStatus.OK)
                .data(data)
                .timestamp(LocalDate.from(LocalDateTime.now()))
                .build();

        return ResponseEntity.ok(response);
    }

    public static <T> ResponseEntity<CustomApiResponse<T>> ok(T data, String message) {
        CustomApiResponse<T> response = CustomApiResponse.<T>builder()
                .status(HttpStatus.OK)
                .message(message)
                .data(data)
                .timestamp(LocalDate.from(LocalDateTime.now()))
                .build();
        return ResponseEntity.ok(response);
    }

    public static <T> ResponseEntity<CustomApiResponse<T>> created(T data) {
        CustomApiResponse<T> response = CustomApiResponse.<T>builder()
                .status(HttpStatus.CREATED)
                .data(data)
                .timestamp(LocalDate.from(LocalDateTime.now()))
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    public static <T> ResponseEntity<CustomApiResponse<T>> created(T data, String message) {
        CustomApiResponse<T> response = CustomApiResponse.<T>builder()
                .status(HttpStatus.CREATED)
                .message(message)
                .data(data)
                .timestamp(LocalDate.from(LocalDateTime.now()))
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    public static <T> ResponseEntity<CustomApiResponse<List<T>>> okPage(Page<T> page) {
        CustomApiResponse<List<T>> response = CustomApiResponse.<List<T>>builder()
                .status(HttpStatus.OK)
                .data(page.getContent()) // This returns List<T>
                .pagination(CustomApiResponse.PaginationMetadata.builder()
                        .totalElements((int) page.getTotalElements())
                        .totalPages(page.getTotalPages())
                        .currentPage(page.getNumber())
                        .pageSize(page.getSize())
                        .build())
                .timestamp(LocalDate.from(LocalDateTime.now()))
                .build();
        return ResponseEntity.ok(response);
    }

    public static <T> ResponseEntity<CustomApiResponse<T>> badRequest(T data, String message) {
        CustomApiResponse<T> response = CustomApiResponse.<T>builder()
                .status(HttpStatus.BAD_REQUEST)
                .message(message)
                .data(data)
                .timestamp(LocalDate.from(LocalDateTime.now()))
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    public static <T> ResponseEntity<CustomApiResponse<T>> internalServerError(T data, String message) {
        CustomApiResponse<T> response = CustomApiResponse.<T>builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .message(message)
                .data(data)
                .timestamp(LocalDate.from(LocalDateTime.now()))
                .build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
