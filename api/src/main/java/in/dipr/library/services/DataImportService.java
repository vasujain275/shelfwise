package in.dipr.library.services;

import in.dipr.library.dtos.DataImportResultDTO;
import org.springframework.web.multipart.MultipartFile;

public interface DataImportService {
    DataImportResultDTO importBooksFromCsv(MultipartFile file) throws Exception;
    DataImportResultDTO importUsersFromCsv(MultipartFile file) throws Exception;
    DataImportResultDTO importTransactionsFromCsv(MultipartFile file) throws Exception;
}
