package me.vasujain.shelfwise.configs;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.io.File;
import java.util.concurrent.TimeUnit;

@Configuration
@EnableScheduling
public class CsvFileCleanupConfig {

    private final String TEMP_CSV_PATH = "temp_csvs/";

    @Scheduled(fixedRate = 3, timeUnit = TimeUnit.HOURS)
    public void cleanupTempCsvFiles() {
        File tempDir = new File(TEMP_CSV_PATH);
        if (tempDir.exists() && tempDir.isDirectory()) {
            File[] files = tempDir.listFiles();
            if (files != null) {
                for (File file : files) {
                    if (file.isFile()) {
                        file.delete();
                    }
                }
            }
        }
    }
}
