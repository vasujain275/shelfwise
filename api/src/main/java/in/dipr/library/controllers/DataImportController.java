package in.dipr.library.controllers;

import in.dipr.library.dtos.DataImportResultDTO;
import in.dipr.library.services.DataImportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/import")
@Tag(name = "Data Import", description = "APIs for importing data from CSV files")
public class DataImportController {

    @Autowired
    private DataImportService dataImportService;

    @PostMapping("/books")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Import books from a CSV file", responses = {
            @ApiResponse(responseCode = "200", description = "Books imported successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = DataImportResultDTO.class))),
            @ApiResponse(responseCode = "500", description = "Error importing books")
    })
    public ResponseEntity<DataImportResultDTO> importBooks(@RequestParam("file") MultipartFile file) throws Exception {
        DataImportResultDTO result = dataImportService.importBooksFromCsv(file);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/users")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Import users from a CSV file", responses = {
            @ApiResponse(responseCode = "200", description = "Users imported successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = DataImportResultDTO.class))),
            @ApiResponse(responseCode = "500", description = "Error importing users")
    })
    public ResponseEntity<DataImportResultDTO> importUsers(@RequestParam("file") MultipartFile file) throws Exception {
        DataImportResultDTO result = dataImportService.importUsersFromCsv(file);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/transactions")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Import transactions from a CSV file", responses = {
            @ApiResponse(responseCode = "200", description = "Transactions imported successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = DataImportResultDTO.class))),
            @ApiResponse(responseCode = "500", description = "Error importing transactions")
    })
    public ResponseEntity<DataImportResultDTO> importTransactions(@RequestParam("file") MultipartFile file) throws Exception {
        DataImportResultDTO result = dataImportService.importTransactionsFromCsv(file);
        return ResponseEntity.ok(result);
    }
}
