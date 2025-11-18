package in.dipr.library.util;

import org.apache.commons.csv.CSVRecord;
import org.apache.commons.lang3.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.function.Function;

public class CsvUtils {

    private static final DateTimeFormatter LOCAL_DATE_TIME_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
    private static final DateTimeFormatter LOCAL_DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;

    public static String getString(CSVRecord record, String header) {
        return record.isMapped(header) ? record.get(header) : null;
    }

    public static Integer getInteger(CSVRecord record, String header) {
        return getField(record, header, Integer::parseInt);
    }

    public static BigDecimal getBigDecimal(CSVRecord record, String header) {
        return getField(record, header, BigDecimal::new);
    }

    public static LocalDate getLocalDate(CSVRecord record, String header) {
        return getField(record, header, s -> {
            if (s == null || s.trim().isEmpty() || s.trim().equals("0")) return null;
            try {
                return LocalDate.parse(s, LOCAL_DATE_FORMATTER);
            } catch (Exception e) {
                return null;
            }
        });
    }

    public static LocalDateTime getLocalDateTime(CSVRecord record, String header) {
        return getField(record, header, s -> {
            if (s == null || s.trim().isEmpty() || s.trim().equals("0")) return null;
            try {
                return LocalDateTime.parse(s, LOCAL_DATE_TIME_FORMATTER);
            } catch (Exception e) {
                return null;
            }
        });
    }

    public static <T extends Enum<T>> T getEnum(CSVRecord record, String header, Class<T> enumClass) {
        return getField(record, header, s -> Enum.valueOf(enumClass, s));
    }

    public static Boolean getBoolean(CSVRecord record, String header) {
        return getField(record, header, Boolean::parseBoolean);
    }

    private static <T> T getField(CSVRecord record, String header, Function<String, T> converter) {
        if (!record.isMapped(header)) {
            return null;
        }
        String value = record.get(header);
        if (StringUtils.isBlank(value)) {
            return null;
        }
        try {
            return converter.apply(value.trim());
        } catch (Exception e) {
            // Log the error or handle it as needed
            System.err.println("Error parsing header '" + header + "' with value '" + value + "': " + e.getMessage());
            return null;
        }
    }
}