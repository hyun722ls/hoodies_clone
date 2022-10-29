FROM openjdk:8-jdk

WORKDIR .

RUN echo "$PWD"

RUN echo $(ls -l)

COPY build/libs/Hoodies-0.0.1-SNAPSHOT.jar application.jar

EXPOSE 8080

CMD ["java", "-jar", "application.jar"]

