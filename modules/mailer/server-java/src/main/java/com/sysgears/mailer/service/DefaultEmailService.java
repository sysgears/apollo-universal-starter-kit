package com.sysgears.mailer.service;

import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

import javax.mail.internet.MimeMessage;
import java.util.Map;

@Service
public class DefaultEmailService implements EmailService {
    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;
    private final String baseUrl;
    private final String profileRedirectedUrl;

    public DefaultEmailService(JavaMailSender mailSender,
                               SpringTemplateEngine templateEngine,
                               @Value("${app.server.baseUrl}") String baseUrl,
                               @Value("${app.redirect.profile}") String profileRedirectedUrl) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
        this.baseUrl = baseUrl;
        this.profileRedirectedUrl = profileRedirectedUrl;
    }

    public void sendRegistrationConfirmEmail(String name, String email, String confirmationPath) {
        Context context = new Context();
        String confirmationLink = UriComponentsBuilder.newInstance()
                .scheme(baseUrl.contains("localhost") ? "http" : "https")
                .host(baseUrl)
                .path(confirmationPath)
                .build()
                .toString();
        context.setVariables(Map.of("name", name, "followLink", confirmationLink));

        String emailBody = templateEngine.process("confirm-registration", context);

        mailSender.send(createMessage(email, "Confirm Email", emailBody));
    }

    public void sendResetPasswordEmail(String email, String resetPasswordPath) {
        Context context = new Context();
        String confirmationLink = UriComponentsBuilder.newInstance()
                .scheme(baseUrl.contains("localhost") ? "http" : "https")
                .host(baseUrl)
                .path(resetPasswordPath)
                .build()
                .toString();
        context.setVariables(Map.of("followLink", confirmationLink));

        String emailBody = templateEngine.process("reset-password", context);

        mailSender.send(createMessage(email, "Reset Password", emailBody));
    }

    public void sendPasswordUpdatedEmail(String email) {
        Context context = new Context();

        context.setVariables(Map.of("followLink", profileRedirectedUrl));

        String emailBody = templateEngine.process("password-updated", context);

        mailSender.send(createMessage(email, "Your Password Has Been Updated", emailBody));
    }

    @SneakyThrows
    public MimeMessage createMessage(String to, String subject, String text) {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper messageHelper = new MimeMessageHelper(message, false, "UTF-8");
        messageHelper.setTo(to);
        messageHelper.setSubject(subject);
        messageHelper.setText(text, true);
        return message;
    }
}
