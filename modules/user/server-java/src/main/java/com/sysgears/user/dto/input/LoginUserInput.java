package com.sysgears.user.dto.input;

import lombok.Data;
import org.springframework.lang.NonNull;

@Data
public class LoginUserInput {
    @NonNull
    private final String usernameOrEmail;
    @NonNull
    private final String password;
}
