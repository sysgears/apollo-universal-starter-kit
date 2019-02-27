package graphql.model;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EditUserInput {
    @NonNull
    private Integer id;
    @NonNull
    private String username;
    @NonNull
    private String email;
    private String password;
    @NonNull
    private String role;
    private Boolean isActive;
    private ProfileInput profile;
    private AuthInput auth;

    public User transform() {
        return User.builder()
                .id(this.getId())
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
