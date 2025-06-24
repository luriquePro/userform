FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY . /app
RUN ./mvnw clean package -DskipTests
EXPOSE 3333
CMD ["java", "-jar", "target/userform-0.0.1-SNAPSHOT.jar"]
