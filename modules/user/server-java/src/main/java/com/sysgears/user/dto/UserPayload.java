package com.sysgears.user.dto;

import com.sysgears.user.model.User;
import lombok.Data;

@Data
public class UserPayload {
    private final User user;
}
