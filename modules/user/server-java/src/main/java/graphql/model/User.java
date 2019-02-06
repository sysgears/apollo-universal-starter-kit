package graphql.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private String username;
    private String role;
    private Boolean isActive;
    private String email;
    @OneToOne(fetch = FetchType.EAGER , cascade = { CascadeType.PERSIST })
    private UserProfile profile;
    @OneToOne(fetch = FetchType.EAGER , cascade = { CascadeType.PERSIST })
    private UserAuth auth;
}
