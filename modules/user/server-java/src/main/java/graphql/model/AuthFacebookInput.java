package graphql.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthFacebookInput {
    private String fbId;
    private String displayName;

    public FacebookAuth transform() {
        return FacebookAuth.builder().fbId(this.fbId).displayName(this.displayName).build();
    }
}
