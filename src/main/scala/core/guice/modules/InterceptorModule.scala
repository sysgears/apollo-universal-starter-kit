package core.guice.modules

import com.google.inject.matcher.Matchers
import core.interceptor.{InterceptorService, Interceptors}
import net.codingwell.scalaguice.ScalaModule

class InterceptorModule extends ScalaModule {

  override def configure() {
    bindInterceptor(Matchers.any(), Matchers.annotatedWith(classOf[Interceptors]), new InterceptorService())
  }
}