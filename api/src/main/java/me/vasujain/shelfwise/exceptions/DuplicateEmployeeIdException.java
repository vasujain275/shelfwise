
package me.vasujain.shelfwise.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicateEmployeeIdException extends RuntimeException {
    public DuplicateEmployeeIdException(String message) {
        super(message);
    }
}
