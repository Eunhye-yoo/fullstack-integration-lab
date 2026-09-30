package com.co.mybatis;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;


@SpringBootApplication
@ComponentScan(basePackages = {"com.co.mybatis", "com.co.config"})
public class BootMyBatisApplication {

	public static void main(String[] args) {
		SpringApplication.run(BootMyBatisApplication.class, args);
	}

}
