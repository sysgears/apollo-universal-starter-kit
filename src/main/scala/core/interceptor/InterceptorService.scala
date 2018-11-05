package core.interceptor

import javax.inject.Inject
import org.aopalliance.intercept.{MethodInterceptor, MethodInvocation}

import scala.concurrent.ExecutionContext

class InterceptorService @Inject()(implicit executionContext: ExecutionContext) extends MethodInterceptor {
  override def invoke(invocation: MethodInvocation): AnyRef = {
    invocation.proceed()
  }
}