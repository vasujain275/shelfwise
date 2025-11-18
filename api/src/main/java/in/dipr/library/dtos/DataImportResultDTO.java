package in.dipr.library.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DataImportResultDTO {
    private int successfulImports;
    private int failedImports;
    private List<String> failedRecordIdentifiers;
    private String message;
}
