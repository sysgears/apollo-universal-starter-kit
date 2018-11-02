package core.interceptor

import org.aopalliance.intercept.{MethodInterceptor, MethodInvocation}

class InterceptorService extends MethodInterceptor {
  override def invoke(invocation: MethodInvocation): AnyRef = ???
}