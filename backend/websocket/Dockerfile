FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline

COPY src/ ./src/

EXPOSE 3005

CMD ["./mvnw", "spring-boot:run"]