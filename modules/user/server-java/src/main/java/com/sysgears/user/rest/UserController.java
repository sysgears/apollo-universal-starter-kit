package com.sysgears.user.rest;

import com.sysgears.authentication.service.jwt.JwtParser;
import com.sysgears.user.exception.UserNotFoundException;
import com.sysgears.user.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService userService;
    private final JwtParser jwtParser;
    private final String confirmRegistrationRedirectUrl;
    private final String resetPasswordRedirectUrl;

    public UserController(UserService userService,
                          JwtParser jwtParser,
                          @Value("${app.redirect.confirm-registration}") String confirmRegistrationRedirectUrl,
                          @Value("${app.redirect.reset-password}") String resetPasswordRedirectUrl) {
        this.userService = userService;
        this.jwtParser = jwtParser;
        this.confirmRegistrationRedirectUrl = confirmRegistrationRedirectUrl;
        this.resetPasswordRedirectUrl = resetPasswordRedirectUrl;
    }

    @GetMapping("/confirm")
    public RedirectView confirmRegistration(@RequestParam String key) {
        Integer userId = jwtParser.getIdFromVerificationToken(key);
        return userService.findUserById(userId).thenApply(user -> {
                    if (user == null) throw new UserNotFoundException();

                    user.setIsActive(true);
                    userService.save(user);

                    return new RedirectView(confirmRegistrationRedirectUrl);
                }
        ).join();
    }

    @GetMapping("/reset-password")
    public RedirectView initiateResetPassword(@RequestParam String key) {
        Integer userId = jwtParser.getIdFromVerificationToken(key);
        userService.findUserById(userId).thenApply(user -> {
                    if (user == null) throw new UserNotFoundException();
                    return user;
                }
        );
        String base64Key = Base64.getEncoder().encodeToString(key.getBytes(StandardCharsets.UTF_8));
        return new RedirectView(resetPasswordRedirectUrl + base64Key);
    }
}
