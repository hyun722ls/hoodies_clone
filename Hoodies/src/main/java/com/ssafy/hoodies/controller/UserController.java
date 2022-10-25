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

    @GetMapping("/check/{id}")
    public Map<String, Object> checkId(@PathVariable String id) throws Exception {
        Optional<User> user = userRepository.findById(id);
        Map<String, Object> resultMap = new HashMap<>();

        int cnt = 1;
        cnt = user.isPresent() ? 1 : 0;

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
        if(!nowTime.before(time)) {
            resultMap.put("statusCode", FAIL);
            return resultMap;
        }
        resultMap.put("statusCode", SUCCESS);
        return resultMap;
    }
}
