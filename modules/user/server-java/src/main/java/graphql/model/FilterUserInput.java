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
public class FilterUserInput {

    @JsonIgnore
    private String searchText;
    @JsonIgnore
    private String role;
    @JsonIgnore
    private Boolean isActive;

    @JsonProperty("searchText")
    public Optional<String> getSearchText(){
        return Optional.ofNullable(searchText);
    }

    @JsonProperty("role")
    public Optional<String> getRole(){
        return Optional.ofNullable(role);
    }

    @JsonProperty("isActive")
    public Optional<Boolean> getIsActive(){
        return Optional.ofNullable(isActive);
    }
}
