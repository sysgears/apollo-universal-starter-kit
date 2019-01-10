package model

import com.byteslounge.slickrepo.meta.Entity
import spray.json.{DefaultJsonProtocol, JsonFormat}

/**
  * The 'Item' entity.
  */
case class Item(id: Option[Int] = None, description: String) extends Entity[Item, Int] {

  override def withId(id: Int): Item = this.copy(id = Some(id))
}

object ItemJsonProtocol extends DefaultJsonProtocol {
  implicit val itemFormat: JsonFormat[Item] = jsonFormat2(Item)
}
