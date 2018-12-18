package model.oauth

import model.oauth.facebook.FacebookAuth
import model.oauth.github.GithubAuth
import model.oauth.google.GoogleAuth
import model.oauth.linkedin.LinkedinAuth

case class UserAuth(certificate: Option[CertificateAuth],
                    facebook: Option[FacebookAuth],
                    google: Option[GoogleAuth],
                    github: Option[GithubAuth],
                    linkedin: Option[LinkedinAuth])