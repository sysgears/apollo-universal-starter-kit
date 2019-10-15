package graphql.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "USER_AUTH")
public class UserAuth {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID", nullable = false)
    @JsonIgnore
    private Integer id;
    @OneToOne(fetch = FetchType.EAGER , cascade = { CascadeType.ALL })
    private CertificateAuth certificate;
    @OneToOne(fetch = FetchType.EAGER , cascade = { CascadeType.ALL })
    private FacebookAuth facebook;
    @OneToOne(fetch = FetchType.EAGER , cascade = { CascadeType.ALL })
    private GoogleAuth google;
    @OneToOne(fetch = FetchType.EAGER , cascade = { CascadeType.ALL })
    private GithubAuth github;
    @OneToOne(fetch = FetchType.EAGER , cascade = { CascadeType.ALL })
    private LinkedInAuth linkedin;
}
