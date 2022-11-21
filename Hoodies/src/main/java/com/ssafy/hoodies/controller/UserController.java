package com.ssafy.hoodies.controller;

import com.ssafy.hoodies.model.entity.Board;
import com.ssafy.hoodies.model.service.SecurityService;
import com.ssafy.hoodies.model.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Api(tags = {"유저 API"})
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@RestController
@RequestMapping("/user")
public class UserController {
    private static final String SUCCESS = "200";
    private static final String FAIL = "403";
    private static final String BAD_REQUEST = "400";
    private final UserService userService;
    private final SecurityService securityService;
    private final static String STATUS_CODE = "statusCode";

    @ApiOperation(value = "닉네임 중복 체크")
    @GetMapping("/check/{nickname}")
    public Map<String, Object> checkNickname(@PathVariable String nickname) {
        Map<String, Object> resultMap = new HashMap<>();

        int cnt = userService.checkNickname(nickname);

        resultMap.put("cnt", cnt);
        resultMap.put(STATUS_CODE, SUCCESS);
        return resultMap;
    }

    @ApiOperation(value = "회원가입 MM 인증 메시지 전송")
    @GetMapping("/auth/{email}")
    public Map<String, Object> sendSignUpMM(@PathVariable String email) {
        Map<String, Object> resultMap = new HashMap<>();

        String authcode = userService.sendSignUpMM(email, 1);
        if ("fail".equals(authcode)) {
            resultMap.put(STATUS_CODE, FAIL);
            return resultMap;
        }

        resultMap.put(STATUS_CODE, SUCCESS);
        return resultMap;
    }


    @ApiOperation(value = "회원가입 MM 인증 메시지 검증")
    @PostMapping("/auth")
    public Map<String, Object> authMM(@RequestBody Map<String, String> map) {
        Map<String, Object> resultMap = new HashMap<>();
        String email = map.getOrDefault("email", "");
        String authcode = map.getOrDefault("authcode", "");

        boolean authFlag = userService.authMM(email, authcode);
        // 인증에 실패한 경우
        if (!authFlag) {
            resultMap.put(STATUS_CODE, FAIL);
            return resultMap;
        }

        resultMap.put(STATUS_CODE, SUCCESS);
        return resultMap;
    }

    @ApiOperation(value = "비밀번호 초기화 인증 메시지 전송")
    @GetMapping("/resetPassword/{email}")
    public Map<String, Object> sendResetPassword(@PathVariable String email) {
        Map<String, Object> resultMap = new HashMap<>();

        String authcode = userService.sendResetPassword(email, 1);
        if ("fail".equals(authcode)) {
            resultMap.put(STATUS_CODE, FAIL);
            return resultMap;
        }

        resultMap.put(STATUS_CODE, SUCCESS);
        return resultMap;
    }

    @ApiOperation(value = "비밀번호 초기화 인증 메시지 검증")
    @PostMapping("/resetPassword")
    public Map<String, Object> authResetPassword(@RequestBody Map<String, String> map) {
        Map<String, Object> resultMap = new HashMap<>();

        String email = map.getOrDefault("email", "");
        String authcode = map.getOrDefault("authcode", "");

        String password = userService.authResetPassword(email, authcode);
        if ("fail".equals(password)) {
            resultMap.put(STATUS_CODE, FAIL);
            return resultMap;
        }

        resultMap.put("password", password);
        resultMap.put(STATUS_CODE, SUCCESS);
        return resultMap;
    }

    @ApiOperation(value = "닉네임 변경")
    @PutMapping("/nickname")
    public Map<String, Object> updateNickname(@RequestBody Map<String, String> map) {
        Map<String, Object> resultMap = new HashMap<>();

        String email = securityService.findEmail();
        String nickname = map.getOrDefault("nickname", "");

        String enickname = userService.updateNickname(email, nickname);
        if ("fail".equals(enickname)) {
            resultMap.put(STATUS_CODE, FAIL);
            return resultMap;
        }
        resultMap.put("hashNickname", enickname);
        resultMap.put(STATUS_CODE, SUCCESS);
        return resultMap;
    }

    @ApiOperation(value = "비밀번호 변경")
    @PutMapping("/password")
    public Map<String, Object> updatePassword(@RequestBody Map<String, String> map) {
        Map<String, Object> resultMap = new HashMap<>();

        String email = securityService.findEmail();
        String password = map.getOrDefault("password", "");

        String result = userService.updatePassword(email, password);
        if (result.equals("fail"))
            resultMap.put(STATUS_CODE, BAD_REQUEST);
        else if (result.equals("bad"))
            resultMap.put(STATUS_CODE, FAIL);
        else
            resultMap.put(STATUS_CODE, SUCCESS);
        return resultMap;
    }

    @GetMapping("/article/{writer}")
    @ApiOperation(value = "사용자가 쓴 글 조회")
    public List<Board> findUserBoard(@ApiParam(name = "writer", type = "String", value = "게시물의 DB상 writer, 닉네임", required = true) @PathVariable String writer) {
        return userService.findUserBoard(writer);
    }
}
