package graphql.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthGoogleInput {
    private String googleId;
    private String displayName;

    public GoogleAuth transform() {
        return GoogleAuth.builder().googleId(this.googleId).displayName(this.displayName).build();
    }
}
