package com.sysgears.user.dto.input;

import lombok.Data;
import lombok.NonNull;

@Data
public class ResetPasswordInput {
    @NonNull
    private final String token;
    @NonNull
    private final String password;
    @NonNull
    private final String passwordConfirmation;
}
