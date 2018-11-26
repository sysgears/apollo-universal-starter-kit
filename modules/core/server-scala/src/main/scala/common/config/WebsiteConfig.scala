package common.config

import com.google.inject.Inject
import com.typesafe.config.Config

class WebsiteConfig @Inject()(config: Config)  {
  val url: String = config.getString("website.url")
}