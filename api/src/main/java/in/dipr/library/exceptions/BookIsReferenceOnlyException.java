package in.dipr.library.exceptions;

public class BookIsReferenceOnlyException extends RuntimeException {
    public BookIsReferenceOnlyException(String message) {
        super(message);
    }
}