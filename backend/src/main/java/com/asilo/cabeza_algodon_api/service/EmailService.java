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
        enviarNotificacion(destinatario, nombrePaciente, especialidad, "Evaluacion medica especializada y seguimiento clinico.");
    }

    @Async
    public void enviarNotificacion(String destinatario, String nombrePaciente, String especialidad, String motivo) {
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

            // Version texto plano
            String cuerpoTexto = String.format(
                "NOTIFICACION DE REFERENCIA MEDICA\n" +
                "Asilo de Ancianos Cabeza de Algodon\n" +
                "--------------------------------------------------\n\n" +
                "Estimado(a) familiar responsable,\n\n" +
                "Por medio de la presente se le notifica que el medico general de nuestra institucion " +
                "ha generado una solicitud de interconsulta externa para el residente bajo su cuidado.\n\n" +
                "DETALLES DE LA DERIVACION:\n" +
                "  * Residente: %s\n" +
                "  * Especialidad requerida: %s\n" +
                "  * Motivo clinico: %s\n" +
                "  * Centro de atencion: Fundacion Medica Aliada\n" +
                "  * Estado actual: Pendiente de asignacion de fecha y horario\n\n" +
                "La fundacion notificara el turno asignado y el enfermero del asilo que acompanara al residente.\n\n" +
                "Atentamente,\n" +
                "Direccion Medica y Trabajo Social\n" +
                "Asilo de Ancianos Cabeza de Algodon\n" +
                "PBX: +502 2368-8302 | soporte@cabezaalgodon.com.gt",
                nombrePaciente, especialidad, motivo
            );

            // Version HTML
            String cuerpoHtml = String.format("""
                <!DOCTYPE html>
                <html lang="es">
                <head>
                  <meta charset="UTF-8">
                  <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #1e293b; }
                    .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
                    .header { background-color: #1e3a8a; color: #ffffff; padding: 24px; text-align: center; }
                    .header h2 { margin: 0; font-size: 20px; font-weight: 600; letter-spacing: 0.5px; }
                    .header p { margin: 4px 0 0 0; font-size: 13px; opacity: 0.85; }
                    .content { padding: 28px 24px; font-size: 14px; line-height: 1.6; }
                    .badge { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 4px; font-weight: 600; font-size: 12px; margin-bottom: 16px; }
                    .info-table { width: 100%%; border-collapse: collapse; margin: 18px 0; background-color: #f8fafc; border-radius: 6px; }
                    .info-table td { padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
                    .info-table td.label { font-weight: 600; color: #475569; width: 38%%; }
                    .info-table td.value { color: #0f172a; }
                    .footer { background-color: #f8fafc; padding: 18px 24px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center; line-height: 1.5; }
                  </style>
                </head>
                <body>
                  <div class="card">
                    <div class="header">
                      <h2>Asilo de Ancianos Cabeza de Algodon</h2>
                      <p>Sistema de Gestion Clinica y Notificaciones</p>
                    </div>
                    <div class="content">
                      <span class="badge">NOTIFICACION OFICIAL DE REFERENCIA</span>
                      <p>Estimado(a) familiar responsable,</p>
                      <p>Le informamos que el medico general de nuestra institucion ha emitido una orden de interconsulta especializada para el residente bajo su tutela:</p>
                      
                      <table class="info-table">
                        <tr>
                          <td class="label">Residente:</td>
                          <td class="value"><strong>%s</strong></td>
                        </tr>
                        <tr>
                          <td class="label">Especialidad requerida:</td>
                          <td class="value">%s</td>
                        </tr>
                        <tr>
                          <td class="label">Motivo clinico:</td>
                          <td class="value">%s</td>
                        </tr>
                        <tr>
                          <td class="label">Centro receptor:</td>
                          <td class="value">Fundacion Medica Aliada</td>
                        </tr>
                        <tr>
                          <td class="label">Estado de la solicitud:</td>
                          <td class="value"><span style="color: #b45309; font-weight: 600;">Pendiente de cita y horario</span></td>
                        </tr>
                      </table>
                      
                      <p style="font-size: 13px; color: #475569;">
                        La Fundacion asignara al medico especialista y la fecha correspondiente. El residente sera trasladado y acompanado por personal de enfermeria del asilo.
                      </p>
                    </div>
                    <div class="footer">
                      <strong>Direccion Medica y Trabajo Social</strong><br>
                      Asilo de Ancianos Cabeza de Algodon | PBX: +502 8877-ASILO<br>
                      Este es un correo automatico generado por el sistema institucional.
                    </div>
                  </div>
                </body>
                </html>
                """, nombrePaciente, especialidad, motivo);

            Map<String, Object> body = new HashMap<>();
            body.put("from", "Asilo Cabeza de Algodon <notificaciones@cabezaalgodon.com.gt>");
            body.put("to", List.of(destinatario));
            body.put("subject", "Referencia Medica: " + nombrePaciente + " - " + especialidad);
            body.put("text", cuerpoTexto);
            body.put("html", cuerpoHtml);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            restTemplate.postForEntity(url, request, String.class);

            System.out.println("Correo estructurado despachado hacia: " + destinatario);
        } catch (Exception e) {
            System.err.println("Fallo al despachar correo mediante Resend: " + e.getMessage());
        }
    }
}