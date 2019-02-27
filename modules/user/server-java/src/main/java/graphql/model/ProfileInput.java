package graphql.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileInput {
    private String firstName;
    private String lastName;

    public UserProfile transform() {
        return UserProfile.builder()
                .firstName(this.firstName)
                .lastName(this.lastName)
                .fullName(this.firstName + " " + this.firstName) //TODO FullName?
                .build();
    }
}
