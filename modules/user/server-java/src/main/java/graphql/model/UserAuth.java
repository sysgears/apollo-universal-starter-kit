package graphql.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
@JsonIgnoreProperties("id")
public class UserAuth {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID", nullable = false)
    private Integer id;
    @OneToOne(fetch = FetchType.EAGER , cascade = { CascadeType.PERSIST })
    private CertificateAuth certificate;
    @OneToOne(fetch = FetchType.EAGER , cascade = { CascadeType.PERSIST })
    private FacebookAuth facebook;
    @OneToOne(fetch = FetchType.EAGER , cascade = { CascadeType.PERSIST })
    private GoogleAuth google;
    @OneToOne(fetch = FetchType.EAGER , cascade = { CascadeType.PERSIST })
    private GithubAuth github;
    @OneToOne(fetch = FetchType.EAGER , cascade = { CascadeType.PERSIST })
    private LinkedInAuth linkedin;
}
