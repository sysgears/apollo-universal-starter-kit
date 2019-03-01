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
public class OrderByUserInput {

    @JsonIgnore
    private String column;
    @JsonIgnore
    private String order;

    @JsonProperty("column")
    public Optional<String> getColumn(){
        return Optional.ofNullable(column);
    }

    @JsonProperty("order")
    public Optional<String> getOrder(){
        return Optional.ofNullable(order);
    }
}
