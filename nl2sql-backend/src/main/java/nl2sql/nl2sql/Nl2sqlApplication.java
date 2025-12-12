package nl2sql.nl2sql;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Nl2sqlApplication {

	public static void main(String[] args) {
		SpringApplication.run(Nl2sqlApplication.class, args);
	}

}
//
//Would you like me to also show how to store the DB connection in a service class so that it stays active between requests (like a session)?
//That makes /api/connect → /api/execute flow seamless without reconnecting every time.