package graphql;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@SpringBootApplication(scanBasePackages = {"graphql"})
@EnableAsync
public class App {

	//TODO Configure thread pool for each module
	@Bean(name = "resolverThreadPoolTaskExecutor")
	public Executor resolverThreadPoolTaskExecutor() {
		ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
		executor.setCorePoolSize(4);
		executor.setMaxPoolSize(50);
		executor.setQueueCapacity(250);
		executor.setWaitForTasksToCompleteOnShutdown(true);
		executor.setThreadNamePrefix("AsyncResolver-");
		executor.initialize();
		return executor;
	}

	//TODO Configure thread pool for each module
	@Bean(name = "repositoryThreadPoolTaskExecutor")
	public Executor repositoryThreadPoolTaskExecutor() {
		ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
		executor.setCorePoolSize(4);
		executor.setMaxPoolSize(100);
		executor.setQueueCapacity(500);
		executor.setWaitForTasksToCompleteOnShutdown(true);
		executor.setThreadNamePrefix("AsyncRepository-");
		executor.initialize();
		return executor;
	}

	public static void main(String[] args) {
		SpringApplication.run(App.class, args);
	}
}