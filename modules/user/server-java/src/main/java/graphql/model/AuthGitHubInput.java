package graphql.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthGitHubInput {
    private String ghId;
    private String displayName;

    public GithubAuth transform() {
        return GithubAuth.builder().ghId(this.ghId).displayName(this.displayName).build();
    }
}
