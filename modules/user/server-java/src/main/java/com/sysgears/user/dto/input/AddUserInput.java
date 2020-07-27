package com.sysgears.user.dto.input;

import com.sysgears.user.dto.input.auth.AuthInput;
import lombok.Data;
import org.springframework.lang.NonNull;

import java.util.Optional;

@Data
public class AddUserInput {
    @NonNull
    private final String username;
    @NonNull
    private final String password;
    @NonNull
    private final String role;
    private final boolean isActive;
    @NonNull
    private final String email;
    private final Optional<ProfileInput> profile;
    private final Optional<AuthInput> auth;
}
