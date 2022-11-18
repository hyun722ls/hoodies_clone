package com.ssafy.hoodies;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HoodiesApplication {

    public static void main(String[] args) {
        // System.setProperty("server.servlet.context-path", "/api");
        SpringApplication.run(HoodiesApplication.class, args);
    }

}
