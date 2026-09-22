# Etapa 1: Compilacion y empaquetado
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# Copiar archivos de Maven y dependencias
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Asignar permisos de ejecucion explicitos dentro del contenedor Linux
RUN chmod +x ./mvnw

# Descargar dependencias
RUN ./mvnw dependency:go-offline -B

# Copiar codigo fuente y compilar omitiendo tests
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Etapa 2: Imagen ligera de ejecucion
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copiar el archivo JAR generado en la etapa anterior
COPY --from=build /app/target/*.jar app.jar

# Puerto por defecto
EXPOSE 8080

# Parametros de memoria optimizados para el Free Tier
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -Xmx384m -jar app.jar"]