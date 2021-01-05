package com.sysgears.user.dto.input;

import lombok.Data;
import org.springframework.lang.NonNull;

@Data
public class ForgotPasswordInput {
    @NonNull
    private final String email;
}
