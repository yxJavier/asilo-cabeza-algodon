package com.asilo.cabeza_algodon_api.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    @Value("${RESEND_API_KEY:}")
    private String resendApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @Async
    public void enviarNotificacion(String destinatario, String nombrePaciente, String especialidad) {
        if (resendApiKey == null || resendApiKey.isBlank()) {
            System.err.println("Aviso: RESEND_API_KEY no esta configurada. No se enviara correo.");
            return;
        }

        if (destinatario == null || destinatario.isBlank()) {
            System.err.println("Aviso: Destinatario vacio o invalido.");
            return;
        }

        try {
            String url = "https://api.resend.com/emails";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(resendApiKey);

            Map<String, Object> body = new HashMap<>();
            body.put("from", "Asilo Cabeza de Algodon <onboarding@resend.dev>");
            body.put("to", List.of(destinatario));
            body.put("subject", "Notificacion de Referencia Medica - Asilo Cabeza de Algodon");
            body.put("text", "Estimado familiar,\n\n"
                    + "Le notificamos que el residente " + nombrePaciente 
                    + " ha sido referido a la especialidad de " + especialidad 
                    + " para su atencion en la Fundacion.\n\n"
                    + "Atentamente,\nDireccion Medica del Asilo.");

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            restTemplate.postForEntity(url, request, String.class);

            System.out.println("Correo despachado exitosamente hacia: " + destinatario);
        } catch (Exception e) {
            System.err.println("Fallo al despachar correo mediante Resend: " + e.getMessage());
        }
    }
}