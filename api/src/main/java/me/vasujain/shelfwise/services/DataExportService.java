package me.vasujain.shelfwise.services;

import java.io.File;

public interface DataExportService {
    File exportBooksToCsv() throws Exception;
    File exportUsersToCsv() throws Exception;
    File exportTransactionsToCsv() throws Exception;
}
