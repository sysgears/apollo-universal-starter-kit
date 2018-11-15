package common

object ListUtil {
  implicit class ListSplit[A](list: List[A]) {
    def cutOff: (A, List[A]) = (list.head, list.tail)
  }
}