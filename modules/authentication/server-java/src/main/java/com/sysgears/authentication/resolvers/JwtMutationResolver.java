package com.sysgears.authentication.resolvers;

import com.sysgears.authentication.model.jwt.Tokens;
import com.sysgears.authentication.service.jwt.JwtGenerator;
import graphql.kickstart.tools.GraphQLMutationResolver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class JwtMutationResolver implements GraphQLMutationResolver {

    private final JwtGenerator jwtGenerator;

    public Tokens refreshTokens(String refreshToken) {
        //todo implement
        return null;
    }
}
