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
public class AuthGoogleInput {
    @JsonIgnore
    private String googleId;
    @JsonIgnore
    private String displayName;

    @JsonProperty("googleId")
    public Optional<String> getGoogleId(){
        return Optional.ofNullable(googleId);
    }

    @JsonProperty("displayName")
    public Optional<String> getDisplayName(){
        return Optional.ofNullable(displayName);
    }
}
