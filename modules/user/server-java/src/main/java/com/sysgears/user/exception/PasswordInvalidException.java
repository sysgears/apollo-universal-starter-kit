package com.sysgears.user.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class PasswordInvalidException extends RuntimeException {

    public PasswordInvalidException() {
        super("Specified password is invalid");
    }
}
