package com.sysgears.user.dto.input;

import lombok.Data;
import org.springframework.lang.NonNull;

@Data
public class RegisterUserInput {
    @NonNull
    private final String username;
    @NonNull
    private final String email;
    @NonNull
    private final String password;
}
