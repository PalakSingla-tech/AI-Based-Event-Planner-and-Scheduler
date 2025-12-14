package com.example.AuroraEvents;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AuroraEventsApplication {

	public static void main(String[] args) {
		ApplicationContext context = SpringApplication.run(AuroraEventsApplication.class, args);
	}

}
