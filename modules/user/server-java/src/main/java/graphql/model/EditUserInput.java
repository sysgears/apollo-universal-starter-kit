package graphql.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.Optional;

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
    @JsonIgnore
    private String password;
    @NonNull
    private String role;
    @JsonIgnore
    private Boolean isActive;
    @JsonIgnore
    private ProfileInput profile;
    @JsonIgnore
    private AuthInput auth;

    @JsonProperty("password")
    public Optional<String> getPassword() {
        return Optional.ofNullable(password);
    }

    @JsonProperty("isActive")
    public Optional<Boolean> getIsActive(){
        return Optional.ofNullable(isActive);
    }

    @JsonProperty("profile")
    public Optional<ProfileInput> getProfile(){
        return Optional.ofNullable(profile);
    }

    @JsonProperty("auth")
    public Optional<AuthInput> getAuth(){
        return Optional.ofNullable(auth);
    }
}
