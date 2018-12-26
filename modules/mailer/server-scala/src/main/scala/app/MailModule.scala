package app

import common.shapes.ServerModule
import guice.MailBinding

class MailModule extends ServerModule {
  bindings = new MailBinding
}