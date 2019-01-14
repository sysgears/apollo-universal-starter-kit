package model

import model.facebook.FacebookAuth
import model.github.GithubAuth
import model.google.GoogleAuth
import model.linkedin.LinkedinAuth

case class UserAuth(
    certificate: Option[CertificateAuth],
    facebook: Option[FacebookAuth],
    google: Option[GoogleAuth],
    github: Option[GithubAuth],
    linkedin: Option[LinkedinAuth]
)
