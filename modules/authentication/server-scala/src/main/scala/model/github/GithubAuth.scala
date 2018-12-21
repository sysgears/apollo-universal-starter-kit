package model.github

import akka.japi.Option.Some
import com.byteslounge.slickrepo.meta.Entity

case class GithubAuth(id: Option[Int],
                      displayName: String,
                      userId: Int) extends Entity[GithubAuth, Int] {

  override def withId(id: Int): GithubAuth = this.copy(id = Some(id))
}
