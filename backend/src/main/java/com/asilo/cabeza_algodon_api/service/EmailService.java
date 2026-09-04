package com.asilo.cabeza_algodon_api.service;

import com.asilo.cabeza_algodon_api.model.SolicitudReferencia;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void enviarAlertaReferencia(SolicitudReferencia solicitud) {
        try {
            SimpleMailMessage mensaje = new SimpleMailMessage();
            mensaje.setTo(solicitud.getCorreoFamiliar());
            mensaje.setSubject(" Notificación Médica: Derivación de " + solicitud.getNombreInterno() + " - Asilo Cabeza de Algodón");
            
            String cuerpo = String.format(
                "Estimado familiar responsable,\n\n" +
                "Le informamos que el Médico General del Asilo Cabeza de Algodón ha emitido una solicitud de referencia médica para su paciente:\n\n" +
                "• Residente: %s\n" +
                "• Especialidad Requerida: %s\n" +
                "• Motivo Clínico: %s\n" +
                "• Estado Actual: %s\n\n" +
                "La Fundación Médica aliada se encuentra programando la cita y el horario correspondiente. " +
                "Le mantendremos informado del agendamiento y los resultados de la consulta.\n\n" +
                "Atentamente,\n" +
                "Dirección Médica y Cuidados Generales\n" +
                "Asilo de Ancianos Cabeza de Algodón",
                solicitud.getNombreInterno(),
                solicitud.getEspecialidad(),
                solicitud.getMotivo(),
                solicitud.getEstado()
            );

            mensaje.setText(cuerpo);
            mailSender.send(mensaje);

            System.out.println(">>> [SMTP ÉXITO] Correo de alerta enviado correctamente a: " + solicitud.getCorreoFamiliar());
        } catch (Exception e) {
            // Se registra el error en consola para auditoría sin romper la persistencia de la referencia
            System.err.println(">>> [SMTP AVISO] No se pudo despachar el correo hacia " + solicitud.getCorreoFamiliar() 
                    + ". Detalle: " + e.getMessage());
        }
    }
}