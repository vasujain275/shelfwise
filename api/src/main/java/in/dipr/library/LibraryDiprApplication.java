package in.dipr.library;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LibraryDiprApplication {

    public static void main(String[] args) {
        SpringApplication.run(LibraryDiprApplication.class, args);
    }

}
