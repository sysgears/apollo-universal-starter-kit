package core.services.persistence

trait PersistenceCleanup {

  def deleteStorageLocations(): Unit
}
