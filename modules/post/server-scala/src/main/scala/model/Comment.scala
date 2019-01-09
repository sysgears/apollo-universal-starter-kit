package model

import akka.japi.Option.Some
import com.byteslounge.slickrepo.meta.Entity

/**
  * The 'Comment' entity
  * @param id
  * @param content
  * @param postId
  */
case class Comment(id: Option[Int] = None, content: String, postId: Int) extends Entity[Comment, Int] {
  override def withId(id: Int): Comment = this.copy(id = Some(id))
}
