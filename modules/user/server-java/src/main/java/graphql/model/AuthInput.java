package graphql.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthInput {
    private AuthCertificateInput certificate;
    private AuthFacebookInput facebook;
    private AuthGoogleInput google;
    private AuthGitHubInput github;
    private AuthLinkedInInput linkedin;

    public UserAuth transform() {
        return UserAuth.builder()
                .certificate(this.certificate.transform())
                .facebook(this.facebook.transform())
                .google(this.google.transform())
                .github(this.github.transform())
                .linkedin(this.linkedin.transform())
                .build();
    }
}
