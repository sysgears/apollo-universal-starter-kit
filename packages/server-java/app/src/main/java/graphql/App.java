package graphql;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"graphql"})
public class App {

	public static void main(String[] args) {
		SpringApplication.run(App.class, args);
	}
}