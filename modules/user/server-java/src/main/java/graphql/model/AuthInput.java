package graphql.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Optional;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthInput {
    @JsonIgnore
    private AuthCertificateInput certificate;
    @JsonIgnore
    private AuthFacebookInput facebook;
    @JsonIgnore
    private AuthGoogleInput google;
    @JsonIgnore
    private AuthGitHubInput github;
    @JsonIgnore
    private AuthLinkedInInput linkedin;

    @JsonProperty("certificate")
    public Optional<AuthCertificateInput> getCertificate() {
        return Optional.ofNullable(certificate);
    }

    @JsonProperty("facebook")
    public Optional<AuthFacebookInput> getFacebook() {
        return Optional.ofNullable(facebook);
    }

    @JsonProperty("google")
    public Optional<AuthGoogleInput> getGoogle() {
        return Optional.ofNullable(google);
    }

    @JsonProperty("github")
    public Optional<AuthGitHubInput> getGithub() {
        return Optional.ofNullable(github);
    }

    @JsonProperty("linkedin")
    public Optional<AuthLinkedInInput> getLinkedin() {
        return Optional.ofNullable(linkedin);
    }
}
