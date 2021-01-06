package com.sysgears.authentication.utils;

import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SessionUtils {
    public static final SecurityContext SECURITY_CONTEXT = SecurityContextHolder.createEmptyContext();

    private SessionUtils() {
    }
}
