package graphql.model;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddUserInput {
    @NonNull
    private String username;
    @NonNull
    private String email;
    @NonNull
    private String password;
    @NonNull
    private String role;
    private Boolean isActive;
    private ProfileInput profile;
    private AuthInput auth;

    public User transform() {
        return User.builder()
                .username(this.username)
                .email(this.email)
                .password(this.password)
                .role(this.role)
                .isActive(this.isActive)
                .profile(this.profile.transform())
                .auth(this.auth.transform())
                .build();
    }
}
