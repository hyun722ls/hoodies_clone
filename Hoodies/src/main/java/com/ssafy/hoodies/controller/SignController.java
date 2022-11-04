package com.ssafy.hoodies.controller;

import com.ssafy.hoodies.config.security.JwtTokenProvider;
import com.ssafy.hoodies.model.Role;
import com.ssafy.hoodies.model.entity.Token;
import com.ssafy.hoodies.model.entity.User;
import com.ssafy.hoodies.model.entity.UserAuth;
import com.ssafy.hoodies.model.repository.TokenRepository;
import com.ssafy.hoodies.model.repository.UserAuthRepository;
import com.ssafy.hoodies.model.repository.UserRepository;
import com.ssafy.hoodies.model.service.UserService;
import com.ssafy.hoodies.util.util;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final UserRepository userRepository;
    private final UserAuthRepository userAuthRepository;
    private final TokenRepository tokenRepository;

    @Value("${nickname.salt}")
    private String nicknameSalt;

    private final String ADMIN_EMAIL = "admin";

    @ApiOperation(value = "회원가입")
    @PostMapping
    public Map<String, Object> signup(@RequestBody User user, HttpServletResponse response) {
        Map<String, Object> resultMap = new HashMap<>();
        String emailId = user.getEmail().split("@")[0];

        // 기존 user가 있는 경우
        if (!userRepository.findByEmailStartsWith(emailId + "@").isEmpty()) {
            resultMap.put("statusCode", FAIL);
            return resultMap;
        }

        // 기존 닉네임이 있는 경우
        if (userRepository.findByNickname(user.getNickname()) != null) {
            resultMap.put("statusCode", FAIL);
            return resultMap;
        }

        try {
            UserAuth userAuth = userAuthRepository.findById(user.getEmail()).get();

            // 인증되지 않은 경우
            if (!userAuth.isAuthflag()) {
                resultMap.put("statusCode", FAIL);
                return resultMap;
            }

            String salt = util.getRandomGenerateString(8);
            String encryptPassword = util.getEncryptPassword(user.getPassword(), salt);
            if (encryptPassword == null) {
                resultMap.put("statusCode", FAIL);
                return resultMap;
            }

            user.setSalt(salt);
            user.setPassword(encryptPassword);
            user.setRole(Role.ROLE_USER);
            userRepository.save(user);

            Token tokenInfo = jwtTokenProvider.generateToken("email", user.getEmail(), "token", user.getRole());
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
            resultMap.put("hashNickname", util.getEncryptPassword(user.getNickname(), nicknameSalt));
            resultMap.put("accessToken", accessToken);
            resultMap.put("statusCode", SUCCESS);
        } catch (Exception e) {
            resultMap.put("statusCode", FAIL);
        }
        return resultMap;
    }

    @ApiOperation(value = "로그인")
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User user, HttpServletResponse response) {
        Map<String, Object> resultMap = new HashMap<>();

        try {
            User getUser = userRepository.findById(user.getEmail()).get();

            // 비밀번호가 다른 경우
            String hashPassword = util.getEncryptPassword(user.getPassword(), getUser.getSalt());
            if (!hashPassword.equals(getUser.getPassword())) {
                resultMap.put("statusCode", FAIL);
                return resultMap;
            }

            Token tokenInfo = jwtTokenProvider.generateToken("email", user.getEmail(), "token", getUser.getRole());
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
            if (getUser.getEmail().equals(ADMIN_EMAIL))
                resultMap.put("isAdmin", true);

            resultMap.put("nickname", getUser.getNickname());
            resultMap.put("hashNickname", util.getEncryptPassword(getUser.getNickname(), nicknameSalt));
            resultMap.put("accessToken", accessToken);
            resultMap.put("statusCode", SUCCESS);
        } catch (Exception e) {
            resultMap.put("statusCode", FAIL);
        }
        return resultMap;
    }

    @ApiOperation(value = "로그아웃")
    @GetMapping("/logout")
    public Map<String, Object> login() {
        SecurityContext context = SecurityContextHolder.getContext();
        Authentication authentication = context.getAuthentication();
        String email = ((org.springframework.security.core.userdetails.User) authentication.getPrincipal()).getUsername();

        Map<String, Object> resultMap = new HashMap<>();
        try {
            tokenRepository.deleteById(email);
            resultMap.put("statusCode", SUCCESS);
        } catch (Exception e) {
            resultMap.put("statusCode", FAIL);
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
                resultMap.put("statusCode", FAIL);
                status = HttpStatus.BAD_REQUEST;
                return new ResponseEntity<Map<String, Object>>(resultMap, status);
            }
            String email = tokenInfo.getEmail();

            // refreshToken이 만료되었을 경우
            if (!jwtTokenProvider.validateToken(refreshToken)) {
                resultMap.put("statusCode", EXPIRED);
                status = HttpStatus.BAD_REQUEST;
                return new ResponseEntity<Map<String, Object>>(resultMap, status);
            }

            Role role = userRepository.findById(email).get().getRole();

            String newAccessToken = jwtTokenProvider.generateAccessToken("email", email, "token", role);

            tokenRepository.save(Token.builder().email(email).accessToken(newAccessToken).refreshToken(refreshToken).build());

            resultMap.put("accessToken", newAccessToken);
            resultMap.put("statusCode", SUCCESS);
        } catch (Exception e) {
            resultMap.put("statusCode", FAIL);
            status = HttpStatus.BAD_REQUEST;
        }
        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

}
