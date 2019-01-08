package model

import akka.japi.Option.Some
import com.byteslounge.slickrepo.meta.Entity

case class CertificateAuth(id: Option[Int] = None, serial: Option[String]) extends Entity[CertificateAuth, Int] {

  override def withId(id: Int): CertificateAuth = this.copy(id = Some(id))
}
