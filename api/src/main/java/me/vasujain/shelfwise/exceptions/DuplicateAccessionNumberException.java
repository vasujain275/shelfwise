package me.vasujain.shelfwise.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicateAccessionNumberException extends RuntimeException {
    public DuplicateAccessionNumberException(String message) {
        super(message);
    }
}
