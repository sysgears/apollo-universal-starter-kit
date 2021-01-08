package com.sysgears.user.exception;

import com.sysgears.core.exception.FieldErrorException;

import java.util.Map;

public class UserAlreadyExistsException extends FieldErrorException {

    public UserAlreadyExistsException(Map<String, String> errors) {
        super("User already exists.", errors);
    }
}
