package com.sysgears.user.dto;

import com.sysgears.authentication.model.jwt.Tokens;
import com.sysgears.user.model.User;
import lombok.Data;

@Data
public class AuthPayload {
    private final User user;
    private final Tokens tokens;
}
