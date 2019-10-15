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
public class AuthFacebookInput {
    @JsonIgnore
    private String fbId;
    @JsonIgnore
    private String displayName;

    @JsonProperty("fbId")
    public Optional<String> getFbId(){
        return Optional.ofNullable(fbId);
    }

    @JsonProperty("displayName")
    public Optional<String> getDisplayName(){
        return Optional.ofNullable(displayName);
    }
}
