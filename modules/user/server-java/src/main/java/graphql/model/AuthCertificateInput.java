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
public class AuthCertificateInput {
    @JsonIgnore
    private String serial;

    @JsonProperty("serial")
    public Optional<String> getSerial(){
        return Optional.ofNullable(serial);
    }
}
