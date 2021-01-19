package com.sysgears.contact.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.lang.NonNull;

@Data
public class ContactInput {
    @NonNull
    private final String name;
    @NonNull
    private final String email;
    @NonNull
    private final String content;
}
