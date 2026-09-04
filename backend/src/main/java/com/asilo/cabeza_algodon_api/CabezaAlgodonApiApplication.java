package com.asilo.cabeza_algodon_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class CabezaAlgodonApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(CabezaAlgodonApiApplication.class, args);
	}

}
