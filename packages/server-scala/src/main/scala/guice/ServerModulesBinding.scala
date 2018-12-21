package guice

import app._
import com.google.inject.{Provides, Singleton}
import common.graphql.schema.GraphQL
import graphql.GraphQLSchema
import net.codingwell.scalaguice.ScalaModule

class ServerModulesBinding extends ScalaModule {

  override def configure(): Unit = {
    bind(classOf[GraphQL]).to(classOf[GraphQLSchema])
  }

  @Provides
  @Singleton
  def serverModules(contactModule: ContactModule,
                    userModule: UserModule,
                    uploadModule: UploadModule,
                    paginationModule: PaginationModule,
                    counterModule: CounterModule): GlobalModule = {
    new GlobalModule(
      Seq(
        contactModule,
        userModule,
        uploadModule,
        paginationModule,
        counterModule
      )
    )
  }
}