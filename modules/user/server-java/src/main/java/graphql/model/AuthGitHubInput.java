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
public class AuthGitHubInput {
    @JsonIgnore
    private String ghId;
    @JsonIgnore
    private String displayName;

    @JsonProperty("ghId")
    public Optional<String> getGhId(){
        return Optional.ofNullable(ghId);
    }

    @JsonProperty("displayName")
    public Optional<String> getDisplayName(){
        return Optional.ofNullable(displayName);
    }
}
