package com.ssafy.hoodies.config;

import com.ssafy.hoodies.interceptor.JwtInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@ComponentScan({"com.ssafy.hoodies"})
public class WebConfiguration implements WebMvcConfigurer {

    private JwtInterceptor jwtInterceptor;

    @Autowired
    public WebConfiguration(JwtInterceptor jwtInterceptor) {
        this.jwtInterceptor = jwtInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
//        registry.addInterceptor(jwtInterceptor).addPathPatterns("/board/**");
    }
}
