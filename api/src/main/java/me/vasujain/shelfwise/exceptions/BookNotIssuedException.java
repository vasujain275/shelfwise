package me.vasujain.shelfwise.exceptions;

public class BookNotIssuedException extends RuntimeException {
    public BookNotIssuedException(String message) {
        super(message);
    }
}