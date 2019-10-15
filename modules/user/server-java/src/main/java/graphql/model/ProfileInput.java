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
public class ProfileInput {
    @JsonIgnore
    private String firstName;
    @JsonIgnore
    private String lastName;

    @JsonProperty("firstName")
    public Optional<String> getFirstName() {
        return Optional.ofNullable(firstName);
    }
    @JsonProperty("lastName")
    public Optional<String> getLastName() {
        return Optional.ofNullable(lastName);
    }
}
