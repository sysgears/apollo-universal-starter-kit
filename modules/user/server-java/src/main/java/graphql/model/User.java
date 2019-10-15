package graphql.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "USER")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID", nullable = false)
    private Integer id;
    @NonNull
    private String username;
    @NonNull
    private String role;
    @JsonIgnore
    private String password;
    private Boolean isActive;
    @NonNull
    private String email;
    @OneToOne(fetch = FetchType.EAGER , cascade = { CascadeType.ALL })
    private UserProfile profile;
    @OneToOne(fetch = FetchType.EAGER , cascade = { CascadeType.ALL })
    private UserAuth auth;
}
