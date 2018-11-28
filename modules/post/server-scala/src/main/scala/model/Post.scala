package model

import akka.japi.Option.Some
import com.byteslounge.slickrepo.meta.Entity

case class Post(id: Option[Int] = None,
                title: String,
                content: String) extends Entity[Post, Int] {
  override def withId(id: Int): Post = this.copy(id = Some(id))
}

