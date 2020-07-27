package com.sysgears.user.dto.input.auth;

import lombok.Data;

import java.util.Optional;

@Data
public class AuthInput {
    private final Optional<AuthCertificateInput> certificate;
    private final Optional<AuthFacebookInput> facebook;
    private final Optional<AuthGoogleInput> google;
    private final Optional<AuthGitHubInput> github;
    private final Optional<AuthLinkedInInput> linkedin;
}
