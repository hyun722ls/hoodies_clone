package com.ssafy.hoodies.controller;

import com.ssafy.hoodies.config.security.JwtTokenProvider;
import com.ssafy.hoodies.model.Role;
import com.ssafy.hoodies.model.entity.Token;
import com.ssafy.hoodies.model.entity.User;
import com.ssafy.hoodies.model.repository.TokenRepository;
import com.ssafy.hoodies.model.repository.UserAuthRepository;
import com.ssafy.hoodies.model.repository.UserRepository;
import com.ssafy.hoodies.model.service.SecurityService;
import com.ssafy.hoodies.model.service.SignService;
import com.ssafy.hoodies.model.service.UserService;
import com.ssafy.hoodies.util.util;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@Api(tags = {"인증 API"})
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@RestController
@RequestMapping("/user")
public class SignController {
    private static final String SUCCESS = "200";
    private static final String FAIL = "403";
    private static final String EXPIRED = "400";

    private final UserRepository userRepository;
    private final UserAuthRepository userAuthRepository;
    private final TokenRepository tokenRepository;

    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final SignService signService;
    private final SecurityService securityService;
    private final static String STATUS_CODE = "statusCode";
    private final static String EMAIL = "email";
    private final static String TOKEN = "token";
    private final static String ACCESS_TOKEN = "accessToken";

    @Value("${nickname.salt}")
    private String nicknameSalt;

    @ApiOperation(value = "회원가입")
    @PostMapping
    public Map<String, Object> signup(@RequestBody User user, HttpServletResponse response) {
        Map<String, Object> resultMap = new HashMap<>();

        String result = signService.signup(user);
        if ("fail".equals(result)) {
            resultMap.put(STATUS_CODE, FAIL);
            return resultMap;
        }

        Token tokenInfo = jwtTokenProvider.generateToken(EMAIL, user.getEmail(), TOKEN, user.getRole());
        String accessToken = tokenInfo.getAccessToken();
        String refreshToken = tokenInfo.getRefreshToken();

        // refresh token response 설정
        Cookie cookie = new Cookie("refreshToken", refreshToken);
        cookie.setMaxAge(24 * 60 * 60); // 1 day
        cookie.setSecure(true);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        response.addCookie(cookie);

        tokenRepository.save(Token.builder().email(user.getEmail()).accessToken(accessToken).refreshToken(refreshToken).build());

        resultMap.put("nickname", user.getNickname());
        resultMap.put("hashNickname", util.getEncryptStr(user.getNickname(), nicknameSalt));
        resultMap.put(ACCESS_TOKEN, accessToken);
        resultMap.put(STATUS_CODE, SUCCESS);
        return resultMap;
    }

    @ApiOperation(value = "로그인")
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User user, HttpServletResponse response) {
        Map<String, Object> resultMap = new HashMap<>();

        try {
            User getUser = userRepository.findById(user.getEmail()).get();

            // 비밀번호가 다른 경우
            String hashPassword = util.getEncryptStr(user.getPassword(), getUser.getSalt());
            if (!hashPassword.equals(getUser.getPassword())) {
                resultMap.put(STATUS_CODE, FAIL);
                return resultMap;
            }

            Token tokenInfo = jwtTokenProvider.generateToken(EMAIL, user.getEmail(), TOKEN, getUser.getRole());
            String accessToken = tokenInfo.getAccessToken();
            String refreshToken = tokenInfo.getRefreshToken();

            // refresh token response 설정
            Cookie cookie = new Cookie("refreshToken", refreshToken);
            cookie.setMaxAge(24 * 60 * 60); // 1 day
            cookie.setSecure(true);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            response.addCookie(cookie);

            tokenRepository.save(Token.builder().email(user.getEmail()).accessToken(accessToken).refreshToken(refreshToken).build());

            // 관리자일 경우
            if (getUser.getRole().equals(Role.ROLE_ADMIN))
                resultMap.put("isAdmin", true);

            resultMap.put("nickname", getUser.getNickname());
            resultMap.put("hashNickname", util.getEncryptStr(getUser.getNickname(), nicknameSalt));
            resultMap.put(ACCESS_TOKEN, accessToken);
            resultMap.put(STATUS_CODE, SUCCESS);
        } catch (Exception e) {
            resultMap.put(STATUS_CODE, FAIL);
        }
        return resultMap;
    }

    @ApiOperation(value = "로그아웃")
    @GetMapping("/logout")
    public Map<String, Object> logout() {
        Map<String, Object> resultMap = new HashMap<>();

        String email = securityService.findEmail();
        try {
            tokenRepository.deleteById(email);
            resultMap.put(STATUS_CODE, SUCCESS);
        } catch (Exception e) {
            resultMap.put(STATUS_CODE, FAIL);
        }
        return resultMap;
    }

    @ApiOperation(value = "토근 재발급")
    @GetMapping("/reissue")
    public ResponseEntity<Map<String, Object>> reissue(@CookieValue("refreshToken") Cookie cookieRefreshToken) {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.OK;

        String refreshToken = cookieRefreshToken.getValue();

        try {
            Token tokenInfo = tokenRepository.findByRefreshToken(refreshToken);
            if (tokenInfo == null) {
                resultMap.put(STATUS_CODE, FAIL);
                status = HttpStatus.BAD_REQUEST;
                return new ResponseEntity<>(resultMap, status);
            }
            String email = tokenInfo.getEmail();

            // refreshToken이 만료되었을 경우
            if (!jwtTokenProvider.validateToken(refreshToken)) {
                resultMap.put(STATUS_CODE, EXPIRED);
                status = HttpStatus.BAD_REQUEST;
                return new ResponseEntity<>(resultMap, status);
            }

            Role role = userRepository.findById(email).get().getRole();

            String newAccessToken = jwtTokenProvider.generateAccessToken(EMAIL, email, TOKEN, role);

            tokenRepository.save(Token.builder().email(email).accessToken(newAccessToken).refreshToken(refreshToken).build());

            resultMap.put(ACCESS_TOKEN, newAccessToken);
            resultMap.put(STATUS_CODE, SUCCESS);
        } catch (Exception e) {
            resultMap.put(STATUS_CODE, FAIL);
            status = HttpStatus.BAD_REQUEST;
        }
        return new ResponseEntity<>(resultMap, status);
    }

}
