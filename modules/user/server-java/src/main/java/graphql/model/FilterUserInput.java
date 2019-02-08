package graphql.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FilterUserInput {

    private String searchText;
    private String role;
    private Boolean isActive;
}
