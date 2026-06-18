FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY sams-backend/pom.xml .
RUN mvn -B dependency:go-offline
COPY sams-backend/src ./src
RUN mvn -B clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
COPY sams-backend/render-entrypoint.sh ./render-entrypoint.sh
RUN chmod +x ./render-entrypoint.sh
ENTRYPOINT ["./render-entrypoint.sh"]
