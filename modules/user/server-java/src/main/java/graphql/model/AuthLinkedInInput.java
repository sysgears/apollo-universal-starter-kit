package graphql.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthLinkedInInput {
    private String lnId;
    private String displayName;

    public LinkedInAuth transform() {
        return LinkedInAuth.builder().lnId(this.lnId).displayName(this.displayName).build();
    }
}
