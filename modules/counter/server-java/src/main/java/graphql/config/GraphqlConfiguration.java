package graphql.config;

import graphql.resolver.CounterResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GraphqlConfiguration {

    @Bean
    public CounterResolver counterResolver() {
        return new CounterResolver();
    }
}