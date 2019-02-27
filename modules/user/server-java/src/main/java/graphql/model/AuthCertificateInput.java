package graphql.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthCertificateInput {
    private String serial;

    public CertificateAuth transform(){
        return CertificateAuth.builder().serial(this.serial).build();
    }
}
