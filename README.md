# Sistema de Administración - Asilo de Ancianos "Cabeza de Algodón"

[![Java](https://img.shields.io/badge/Java-21-orange.svg?logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x%20%2F%204.x-brightgreen.svg?logo=springboot)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-14.x-black.svg?logo=next.js)](https://nextjs.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple.svg?logo=bootstrap)](https://getbootstrap.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg?logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Desktop-2496ED.svg?logo=docker)](https://www.docker.com/)

Plataforma web integral para la gestión clínica, logística y financiera del Asilo "Cabeza de Algodón". Proyecto desarrollado para los cursos de **Análisis y Diseño de Sistemas II** y **Desarrollo Web** en la Universidad Mariano Gálvez de Guatemala (Sede Mazatenango).

---

## Arquitectura del Sistema

El sistema implementa una **arquitectura desacoplada cliente-servidor** basada en tres niveles independientes:

```text
[ Cliente Web (Next.js + Bootstrap) ] :3000
                 │ (HTTP REST / JSON)
                 ▼
[ API Backend (Java Spring Boot + JPA) ] :8080
                 │ (JDBC / HikariCP Pool)
                 ▼
[ Base de Datos (PostgreSQL 16 en Docker) ] :5432
```

---

## Requisitos Previos para SQA / Evaluadores

Para ejecutar y auditar el proyecto en un entorno local se requiere tener instalado:

1. **Docker Desktop** (con motor activo en WSL 2).
2. **Java JDK 21** o superior.
3. **Node.js 18+** y gestor de paquetes **npm**.
4. **Git** para clonar el repositorio.

---

## Guía de Instalación y Despliegue Local

### 1. Clonar el repositorio
```bash
git clone [https://github.com/tu-usuario/asilo-cabeza-algodon.git](https://github.com/tu-usuario/asilo-cabeza-algodon.git)
cd asilo-cabeza-algodon
```

### 2. Base de Datos (PostgreSQL 16 en Contenedor)
Ejecutar el siguiente comando para aprovisionar el contenedor de base de datos con volumen persistente:

```powershell
docker run -d `
  --name postgres-asilo `
  -e POSTGRES_DB=asilo_cabeza_algodon `
  -e POSTGRES_USER=admin `
  -e POSTGRES_PASSWORD=adminpassword `
  -p 5432:5432 `
  -v pgdata_asilo:/var/lib/postgresql/data `
  --restart unless-stopped `
  postgres:16-alpine
```

### 3. Backend (Spring Boot API REST)
Abrir una terminal en la carpeta `/backend` y arrancar el servidor:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```
* El servidor iniciará en `http://localhost:8080`.
* Hibernate generará automáticamente las tablas relacionales (`internos`, `medicamento_cajon`) en Tercera Forma Normal (3FN).

### 4. Frontend (Next.js + Bootstrap)
En una segunda terminal, ingresar a la carpeta `/frontend` y levantar la interfaz de usuario:

```bash
cd frontend
npm install
npm run dev
```
* La aplicación quedará disponible en `http://localhost:3000/residentes`.

---

## Pruebas de Calidad y Verificación (SQA)

### Matriz de Endpoints para Postman / Thunder Client

| Método | Endpoint | Descripción | Payload Requerido |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/internos` | Listado general de residentes activos con medicamentos | Ninguno |
| `POST` | `/api/v1/internos` | Alta de residente y asignación de medicinas en cascada | JSON con estructura clínica |

#### Ejemplo de Carga Útil (`POST /api/v1/internos`):
```json
{
  "nombreCompleto": "Mateo Morales",
  "fechaNacimiento": "1948-05-12",
  "familiarContacto": "familiar.morales@gmail.com",
  "fichaPsicopatologica": "Demencia senil leve",
  "medicinasCajon": [
    {
      "nombreMedicamento": "Losartán",
      "dosisDiaria": "50mg",
      "frecuencia": "Cada 12 horas"
    }
  ]
}
```

---

## Estado de Entrega por Módulos

- [x] **Módulo 1: Expediente Clínico y Medicinas de Cajón (RF-001)** — *Finalizado y persistido.*
- [ ] **Módulo 2: Referencias Médicas y Notificaciones SMTP (RF-003)** — *En desarrollo.*
- [ ] **Módulo 3: Portal Logístico de Fundación y Farmacia** — *Pendiente.*
- [ ] **Módulo 4: Caja, Donaciones Multifuente y Gastos (RF-013)** — *Maquetado.*
- [ ] **Módulo 5: Reportes y Métricas Estadísticas** — *Maquetado.*

---

## Equipo de Trabajo
* **Desarrollador Principal:** Francisco Javier Yax Menchú (Ingeniería en Sistemas, UMG).
* **Catedrático:** Ing. Angel Atilio Maltez C.
* **Auditoría SQA:** Estudiante Revisor Pendiente de verificar.