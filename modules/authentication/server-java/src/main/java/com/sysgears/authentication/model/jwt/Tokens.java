package com.sysgears.authentication.model.jwt;

import lombok.Data;

@Data
public class Tokens {
    private final String accessToken;
    private final String refreshToken;
}
