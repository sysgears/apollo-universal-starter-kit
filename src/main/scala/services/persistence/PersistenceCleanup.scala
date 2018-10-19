package services.persistence

trait PersistenceCleanup {

  def deleteStorageLocations(): Unit
}
