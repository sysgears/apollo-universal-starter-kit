package model

case class AuthInput(
    certificate: Option[AuthCertificateInput],
    facebook: Option[AuthFacebookInput],
    google: Option[AuthGoogleInput],
    github: Option[AuthGitHubInput],
    linkedin: Option[AuthLinkedInInput]
)
