package com.sysgears.user.dto.input;

import lombok.Data;

import java.util.Optional;

@Data
public class ProfileInput {
    private final Optional<String> firstName;
    private final Optional<String> lastName;
}
