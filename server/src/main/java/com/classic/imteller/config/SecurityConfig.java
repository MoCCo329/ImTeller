package com.classic.imteller.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import springfox.documentation.spi.service.contexts.SecurityContext;

@EnableWebSecurity      //기본적인 웹 보안 활성화
//@EnableGlobalMethodSecurity(prePostEnabled = true)  //@PreAuthorize 어노테이션을 메소드단위로 추가하기 위해 적용
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    //passwordEncoder 로는 BCryptPasswordEncoder 사용
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    //antMatchers에 파라미터로 넘겨주는 endpoints는 Spring Security Filter Chain을 거치지 않기 때문에 '인증' , '인가' 서비스가 모두 적용되지 않는다.
    //HttpSecurity보다 우선적용
    //일반적으로 로그인 페이지, public 페이지 등 인증, 인가 서비스가 필요하지 않은 endpoint에 사용
    @Override
    public void configure(WebSecurity web) {
        web.ignoring()
                .antMatchers(
                        "/h2-console/**",
                        "/favicon.ico",
                        "/error",
                        "/api/authenticate",
                        /* swagger v2 */
                        "/v2/api-docs",
                        "/swagger-resources",
                        "/swagger-resources/**",
                        "/configuration/ui",
                        "/configuration/security",
                        "/swagger-ui.html",
                        "/webjars/**",
                        /* swagger v3 */
                        "/v3/api-docs/**",
                        "/swagger-ui/**",
                        "/css/**",
                        "/fonts/**",
                        "/img/**",
                        "/js/**",
                        "/be/auth/**",
                        "/"
                );
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .httpBasic().disable()
                .cors().and()
                .csrf().disable();
//                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS) // 토큰 기반 인증이므로 세션 사용 하지않음
//                .and()
//                .addFilter(new JwtAuthenticationFilter(authenticationManager(), userService)) //HTTP 요청에 JWT 토큰 인증 필터를 거치도록 필터를 추가
//                .authorizeRequests()
//                .antMatchers("/api/v1/users/me").authenticated()       //인증이 필요한 URL과 필요하지 않은 URL에 대하여 설정
//                .anyRequest().permitAll()
    }
}
