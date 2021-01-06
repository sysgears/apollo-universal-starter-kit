package com.sysgears.authentication.service.jwt;

public interface JwtParser {
    Integer getIdFromToken(String token);
}
