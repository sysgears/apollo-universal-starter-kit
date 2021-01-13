package com.sysgears.user.exception;

import com.sysgears.core.exception.FieldErrorException;

import java.util.Map;

public class ResetPasswordException extends FieldErrorException {

    public ResetPasswordException(Map<String, String> errors) {
        super("Failed reset password", errors);
    }
}
