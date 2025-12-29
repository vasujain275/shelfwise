package me.vasujain.shelfwise.exceptions;

public class BookIsReferenceOnlyException extends RuntimeException {
    public BookIsReferenceOnlyException(String message) {
        super(message);
    }
}