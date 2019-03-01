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
public class AuthLinkedInInput {
    @JsonIgnore
    private String lnId;
    @JsonIgnore
    private String displayName;

    @JsonProperty("lnId")
    public Optional<String> getLnId(){
        return Optional.ofNullable(lnId);
    }

    @JsonProperty("displayName")
    public Optional<String> getDisplayName(){
        return Optional.ofNullable(displayName);
    }
}
