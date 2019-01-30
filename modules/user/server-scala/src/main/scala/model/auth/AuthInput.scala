package model.auth

import model.AuthCertificateInput
import model.auth.facebook.AuthFacebookInput
import model.auth.github.AuthGitHubInput
import model.auth.google.AuthGoogleInput
import model.auth.linkedin.AuthLinkedInInput

case class AuthInput(
    certificate: Option[AuthCertificateInput],
    facebook: Option[AuthFacebookInput],
    google: Option[AuthGoogleInput],
    github: Option[AuthGitHubInput],
    linkedin: Option[AuthLinkedInInput]
)
