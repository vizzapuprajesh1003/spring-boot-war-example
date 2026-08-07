FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
# Download dependencies first (layer-cached)
RUN mvn dependency:go-offline -q -Dskip.frontend=true 2>/dev/null || true
COPY src ./src
# Static files already committed — skip frontend npm build
RUN mvn package -DskipTests -Dskip.frontend=true -q

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/unplug-app-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
