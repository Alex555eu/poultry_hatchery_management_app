package com.app.poultry_hatchery_management_app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@EnableTransactionManagement
@SpringBootApplication
public class PoultryHatcheryManagementAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(PoultryHatcheryManagementAppApplication.class, args);
	}

}
