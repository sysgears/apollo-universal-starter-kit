package com.sysgears.user.exception;

import com.sysgears.core.exception.FieldErrorException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.Collections;
import java.util.Map;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class UserNotFoundException extends FieldErrorException {
    public UserNotFoundException() {
        super("No user found", Collections.emptyMap());
    }

    public UserNotFoundException(int id) {
        super(String.format("User with id %d not found.", id), Collections.emptyMap());
    }

    public UserNotFoundException(Map<String, String> errors) {
        super("No user found", errors);
    }
}
