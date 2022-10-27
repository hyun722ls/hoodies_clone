package com.ssafy.hoodies.controller;

import com.ssafy.hoodies.model.model.User;
import com.ssafy.hoodies.model.model.UserAuth;
import com.ssafy.hoodies.model.repository.UserAuthRepository;
import com.ssafy.hoodies.model.repository.UserRepository;
import com.ssafy.hoodies.model.service.JwtService;
import com.ssafy.hoodies.model.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@RequiredArgsConstructor
@RestController
@RequestMapping("/user")
public class UserController {
    private static final String SUCCESS = "200";
    private static final String FAIL = "403";
    private final JwtService jwtService;
    private final UserService userService;
    private final UserRepository userRepository;
    private final UserAuthRepository userAuthRepository;

    @GetMapping("/check/{nickname}")
    public Map<String, Object> checkNickname(@PathVariable String nickname) throws Exception {
        User user = userRepository.findByNickname(nickname);
        Map<String, Object> resultMap = new HashMap<>();

        int cnt = 1;
        cnt = user == null ? 0 : 1;

        resultMap.put("cnt", cnt);
        resultMap.put("statusCode", SUCCESS);
        return resultMap;
    }

    @GetMapping("/auth/{email}")
    public Map<String, Object> sendMM(@PathVariable String email) throws Exception {
        Map<String, Object> resultMap = new HashMap<>();

        String authcode = userService.sendMM(email);
        if (authcode.equals("fail")) {
            resultMap.put("statusCode", FAIL);
            return resultMap;
        }
        Timestamp expireTime = new Timestamp(System.currentTimeMillis());
        expireTime.setTime(expireTime.getTime() + TimeUnit.MINUTES.toMillis(3));
        userAuthRepository.save(UserAuth.builder().email(email).authcode(authcode).time(expireTime).build());
        resultMap.put("statusCode", SUCCESS);
        return resultMap;
    }

    @PostMapping("/auth")
    public Map<String, Object> authMM(@RequestBody Map<String, String> map) throws Exception {
        String email = map.getOrDefault("email", "");
        String authcode = map.getOrDefault("authcode", "");

        UserAuth userAuth = userAuthRepository.findByEmailAndAuthcode(email, authcode);
        Map<String, Object> resultMap = new HashMap<>();
        if (userAuth == null) {
            resultMap.put("statusCode", FAIL);
            return resultMap;
        }

        Timestamp nowTime = new Timestamp(System.currentTimeMillis());
        Timestamp time = userAuth.getTime();

        // 제한시간이 만료되었을 경우
        if (!nowTime.before(time)) {
            resultMap.put("statusCode", FAIL);
            return resultMap;
        }
        resultMap.put("statusCode", SUCCESS);
        return resultMap;
    }

    @PostMapping
    public Map<String, Object> signup(@RequestBody User user) {
        Map<String, Object> resultMap = new HashMap<>();
        String salt = userService.getRandomGenerateString(8);
        String encryptPassword = userService.getEncryptPassword(user.getPassword(), salt);
        if (encryptPassword == null) {
            resultMap.put("statusCode", FAIL);
            return resultMap;
        }

        user.setSalt(salt);
        user.setPassword(encryptPassword);
        userRepository.save(user);

        String token = jwtService.create("email", user.getEmail(), "token");
        resultMap.put("nickname", user.getNickname());
        resultMap.put("token", token);
        resultMap.put("statusCode", SUCCESS);

        return resultMap;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User user) {

        Map<String, Object> resultMap = new HashMap<>();

        try {
            User getUser = userRepository.findById(user.getEmail()).get();

            // 비밀번호가 다른 경우
            String hashPassword = userService.getEncryptPassword(user.getPassword(), getUser.getSalt());
            if (!hashPassword.equals(getUser.getPassword())) {
                resultMap.put("statusCode", FAIL);
                return resultMap;
            }

            String token = jwtService.create("email", user.getEmail(), "token");
            resultMap.put("nickname", getUser.getNickname());
            resultMap.put("token", token);
            resultMap.put("statusCode", SUCCESS);

            return resultMap;
        } catch (Exception e) {
            resultMap.put("statusCode", FAIL);
            return resultMap;
        }
    }

}
