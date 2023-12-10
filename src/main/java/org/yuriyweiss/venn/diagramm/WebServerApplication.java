package org.yuriyweiss.venn.diagramm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class WebServerApplication extends SpringBootServletInitializer {

    public static void main( String[] args ) {
        SpringApplication.run( WebServerApplication.class, args );
    }

    @Override
    protected SpringApplicationBuilder configure( SpringApplicationBuilder builder ) {
        return builder.sources( WebServerApplication.class );
    }
}
