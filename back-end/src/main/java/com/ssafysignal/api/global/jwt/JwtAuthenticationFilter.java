package com.ssafysignal.api.global.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafysignal.api.global.redis.LogoutAccessTokenRedisRepository;
import com.ssafysignal.api.global.response.BasicResponse;
import com.ssafysignal.api.global.response.ResponseCode;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.security.SignatureException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends GenericFilterBean {

    private final JwtTokenUtil jwtTokenUtil;
    private final CustomUserDetailService customUserDetailService;
    private final LogoutAccessTokenRedisRepository logoutAccessTokenRedisRepository;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws ServletException, IOException {
        String accessToken = getToken((HttpServletRequest) request);

        // accessToken 이 있고 redis 에 accessToken 이 존재하지 않을 때 = 로그아웃 상태
        if (accessToken != null && !logoutAccessTokenRedisRepository.existsById(accessToken)) {
            try {
                // 토큰의 정보를 이용해 사용자 정보 생성
                String username = jwtTokenUtil.getUsername(accessToken);
                UserDetails userDetails = customUserDetailService.loadUserByUsername(username);

                System.out.println("userDetails = " + userDetails.toString());

                // 사용자 정보와 토큰을 이용해 토큰 검증
                if (jwtTokenUtil.validateToken(accessToken, userDetails)) {
                    // 이상이 없으면 인가 객체 생성해서 시큐리티 컨텍스트 공간에 저장
                    UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails((HttpServletRequest) request));
                    SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
                }
            } catch (IllegalArgumentException e) {
                throw new JwtException("유효하지 않은 토큰");
            } catch (ExpiredJwtException e) {
                throw new JwtException("토큰 기한 만료");
            }
        }
        chain.doFilter(request, response);
    }
    private String getToken(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        return null;
    }
}