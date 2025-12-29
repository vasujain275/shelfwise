package me.vasujain.shelfwise.controllers;

import me.vasujain.shelfwise.services.DataExportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;

@RestController
@RequestMapping("/api/export")
@Tag(name = "Data Export", description = "APIs for exporting data to CSV files")
public class DataExportController {

    @Autowired
    private DataExportService dataExportService;

    @GetMapping("/books")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Export all books to a CSV file", responses = {
            @ApiResponse(responseCode = "200", description = "CSV file of books"),
            @ApiResponse(responseCode = "500", description = "Error generating the file")
    })
    public ResponseEntity<Resource> exportBooks() throws Exception {
        File file = dataExportService.exportBooksToCsv();
        Resource resource = new FileSystemResource(file);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(resource);
    }

    @GetMapping("/users")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Export all users to a CSV file", responses = {
            @ApiResponse(responseCode = "200", description = "CSV file of users"),
            @ApiResponse(responseCode = "500", description = "Error generating the file")
    })
    public ResponseEntity<Resource> exportUsers() throws Exception {
        File file = dataExportService.exportUsersToCsv();
        Resource resource = new FileSystemResource(file);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(resource);
    }

    @GetMapping("/transactions")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Export all transactions to a CSV file", responses = {
            @ApiResponse(responseCode = "200", description = "CSV file of transactions"),
            @ApiResponse(responseCode = "500", description = "Error generating the file")
    })
    public ResponseEntity<Resource> exportTransactions() throws Exception {
        File file = dataExportService.exportTransactionsToCsv();
        Resource resource = new FileSystemResource(file);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(resource);
    }
}