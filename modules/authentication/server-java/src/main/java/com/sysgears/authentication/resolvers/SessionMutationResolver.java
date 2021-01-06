package com.sysgears.authentication.resolvers;

import graphql.kickstart.tools.GraphQLMutationResolver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class SessionMutationResolver implements GraphQLMutationResolver {

    public String logout() {
        SecurityContextHolder.getContext().setAuthentication(null);
        return null;
    }
}
