package app

import com.google.inject.{Inject, Singleton}
import common.shapes.ServerModule

@Singleton
class AppServerModule @Inject()()(counter: CounterServerModule,
                                  contact: ContactModule) extends ServerModule(Seq(counter, contact))