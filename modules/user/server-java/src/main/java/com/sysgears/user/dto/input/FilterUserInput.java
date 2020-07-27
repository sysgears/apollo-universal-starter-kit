package com.sysgears.user.dto.input;

import lombok.Data;

import java.util.Optional;

@Data
public class FilterUserInput {
    private final Optional<String> searchText;
    private final Optional<String> role;
    private final Optional<Boolean> isActive;
}
