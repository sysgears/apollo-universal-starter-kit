package com.sysgears.user.dto.input;

import lombok.Data;

import java.util.Optional;

@Data
public class OrderByUserInput {
    private final Optional<String> column;
    private final Optional<String> order;
}
