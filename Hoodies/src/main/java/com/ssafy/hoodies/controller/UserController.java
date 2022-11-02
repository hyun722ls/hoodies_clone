package com.ssafy.hoodies.controller;

import com.ssafy.hoodies.model.entity.Board;
import com.ssafy.hoodies.model.entity.User;
import com.ssafy.hoodies.model.entity.UserAuth;
import com.ssafy.hoodies.model.repository.BoardRepository;
import com.ssafy.hoodies.model.repository.UserAuthRepository;
import com.ssafy.hoodies.model.repository.UserRepository;
import com.ssafy.hoodies.model.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Api(tags = {"유저 API"})
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@RestController
@RequestMapping("/user")
public class UserController {
    private static final String SUCCESS = "200";
    private static final String FAIL = "403";
    private final UserService userService;
    private final UserRepository userRepository;
    private final UserAuthRepository userAuthRepository;
    private final BoardRepository boardRepository;

    @ApiOperation(value = "닉네임 중복 체크")
    @GetMapping("/check/{nickname}")
    public Map<String, Object> checkNickname(@PathVariable String nickname) {
        User user = userRepository.findByNickname(nickname);
        Map<String, Object> resultMap = new HashMap<>();

        int cnt = 1;
        cnt = user == null ? 0 : 1;

        resultMap.put("cnt", cnt);
        resultMap.put("statusCode", SUCCESS);
        return resultMap;
    }

    @ApiOperation(value = "회원가입 MM 인증 메시지 전송")
    @GetMapping("/auth/{email}")
    public Map<String, Object> sendMM(@PathVariable String email) {
        Map<String, Object> resultMap = new HashMap<>();

        // 기존 user가 있는 경우
        if (userRepository.findById(email).isPresent()) {
            resultMap.put("statusCode", FAIL);
            return resultMap;
        }

        String authcode = userService.sendMM(email, 1);
        if (authcode.equals("fail")) {
            resultMap.put("statusCode", FAIL);
            return resultMap;
        }

        Timestamp expireTime = new Timestamp(System.currentTimeMillis());
        expireTime.setTime(expireTime.getTime() + TimeUnit.MINUTES.toMillis(3));
        userAuthRepository.save(UserAuth.builder().email(email).authcode(authcode).time(expireTime).authflag(false).build());
        resultMap.put("statusCode", SUCCESS);

        return resultMap;
    }


    @ApiOperation(value = "회원가입 MM 인증 메시지 검증")
    @PostMapping("/auth")
    public Map<String, Object> authMM(@RequestBody Map<String, String> map) {
        Map<String, Object> resultMap = new HashMap<>();
        String email = map.getOrDefault("email", "");
        String authcode = map.getOrDefault("authcode", "");

        // 기존 user가 있는 경우
        if (userRepository.findById(email).isPresent()) {
            resultMap.put("statusCode", FAIL);
            return resultMap;
        }

        UserAuth userAuth = userAuthRepository.findByEmailAndAuthcode(email, authcode);
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

        // 인증 성공
        userAuth.setAuthflag(true);
        userAuthRepository.save(userAuth);

        resultMap.put("statusCode", SUCCESS);
        return resultMap;
    }

    @ApiOperation(value = "비밀번호 초기화 인증 메시지 전송")
    @GetMapping("/resetPassword/{email}")
    public Map<String, Object> sendResetPassword(@PathVariable String email) {
        Map<String, Object> resultMap = new HashMap<>();

        // 기존 user가 없는 경우
        if (!userRepository.findById(email).isPresent()) {
            resultMap.put("statusCode", FAIL);
            return resultMap;
        }

        String authcode = userService.sendMM(email, 1);
        if (authcode.equals("fail")) {
            resultMap.put("statusCode", FAIL);
            return resultMap;
        }

        Timestamp expireTime = new Timestamp(System.currentTimeMillis());
        expireTime.setTime(expireTime.getTime() + TimeUnit.MINUTES.toMillis(3));
        userAuthRepository.save(UserAuth.builder().email(email).authcode(authcode).time(expireTime).authflag(false).build());
        resultMap.put("statusCode", SUCCESS);

        return resultMap;
    }

    @ApiOperation(value = "비밀번호 초기화 인증 메시지 검증")
    @PostMapping("/resetPassword")
    public Map<String, Object> authResetPassword(@RequestBody Map<String, String> map) {
        String email = map.getOrDefault("email", "");
        String authcode = map.getOrDefault("authcode", "");

        Map<String, Object> resultMap = new HashMap<>();

        // 기존 user가 없는 경우
        if (!userRepository.findById(email).isPresent()) {
            resultMap.put("statusCode", FAIL);
            return resultMap;
        }

        UserAuth userAuth = userAuthRepository.findByEmailAndAuthcode(email, authcode);
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

        try {
            User user = userRepository.findById(email).get();

            String salt = user.getSalt();
            String password = userService.sendMM(email, 2);
            String encryptPassword = userService.getEncryptPassword(password, salt);

            if (encryptPassword == null) {
                resultMap.put("statusCode", FAIL);
                return resultMap;
            }

            user.setPassword(encryptPassword);
            userRepository.save(user);

            resultMap.put("password", password);
            resultMap.put("statusCode", SUCCESS);
        } catch (Exception e) {
            resultMap.put("statusCode", FAIL);
        }
        return resultMap;
    }

    @ApiOperation(value = "닉네임 변경")
    @PutMapping("/nickname")
    public Map<String, Object> updateNickname(@RequestBody Map<String, String> map) {
        SecurityContext context = SecurityContextHolder.getContext();
        Authentication authentication = context.getAuthentication();
        String email = ((org.springframework.security.core.userdetails.User) authentication.getPrincipal()).getUsername();
        String nickname = map.getOrDefault("nickname", "");

        Map<String, Object> resultMap = new HashMap<>();
        try {
            User user = userRepository.findById(email).get();

            User nicknameUser = userRepository.findByNickname(nickname);
            // 이미 닉네임이 있는 경우
            if (nicknameUser != null) {
                resultMap.put("statusCode", FAIL);
                return resultMap;
            }

            user.setNickname(nickname);
            userRepository.save(user);

            resultMap.put("statusCode", SUCCESS);
        } catch (Exception e) {
            resultMap.put("statusCode", FAIL);
        }
        return resultMap;
    }

    @ApiOperation(value = "비밀번호 변경")
    @PutMapping("/password")
    public Map<String, Object> updatePassword(@RequestBody Map<String, String> map) {
        SecurityContext context = SecurityContextHolder.getContext();
        Authentication authentication = context.getAuthentication();
        String email = ((org.springframework.security.core.userdetails.User) authentication.getPrincipal()).getUsername();
        String password = map.getOrDefault("password", "");

        Map<String, Object> resultMap = new HashMap<>();
        try {
            User user = userRepository.findById(email).get();

            String salt = user.getSalt();
            String encryptPassword = userService.getEncryptPassword(password, salt);
            String beforePassword = user.getPassword();

            // 이전 비밀번호와 동일한 경우
            if (encryptPassword == null || encryptPassword.equals(beforePassword)) {
                resultMap.put("statusCode", FAIL);
                return resultMap;
            }

            user.setPassword(encryptPassword);
            userRepository.save(user);

            resultMap.put("statusCode", SUCCESS);
        } catch (Exception e) {
            resultMap.put("statusCode", FAIL);
        }
        return resultMap;
    }

    @GetMapping("/article/{writer}")
    @ApiOperation(value = "사용자가 쓴 글 조회")
    public Page<Board> findUserBoard(@ApiParam(
            name = "writer",
            type = "String",
            value = "게시물의 DB상 writer, 닉네임",
            required = true) @PathVariable String writer, Pageable pageable) {

        Sort sort = Sort.by("createdAt").descending();
        return boardRepository.findByWriter(writer, PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort));
    }

}
