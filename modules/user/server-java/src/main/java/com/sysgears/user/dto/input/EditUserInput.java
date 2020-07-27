package com.sysgears.user.dto.input;

import com.sysgears.user.dto.input.auth.AuthInput;
import lombok.Data;
import org.springframework.lang.NonNull;

import java.util.Optional;

@Data
public class EditUserInput {
    @NonNull
    private final int id;
    @NonNull
    private final String username;
    @NonNull
    private final String role;
    private final Optional<Boolean> isActive;
    @NonNull
    private final String email;
    private final Optional<String> password;
    private final Optional<ProfileInput> profile;
    private final Optional<AuthInput> auth;
}
