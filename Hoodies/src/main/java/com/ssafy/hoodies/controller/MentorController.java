package com.ssafy.hoodies.controller;

import com.ssafy.hoodies.model.dto.EvaluationDto;
import com.ssafy.hoodies.model.dto.MentorDto;
import com.ssafy.hoodies.model.service.*;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import org.json.simple.JSONObject;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@Api(tags = {"평가 API"})
public class MentorController {
    private final MentorService mentorService;
    private final EvaluationService evaluationService;
    private final SecurityService securityService;
    private final UserService userService;
    private final FilterService filterService;
    private final static String STATUS_CODE = "statusCode";

    // 전체 평가 페이지 조회
    @GetMapping("mentor")
    @ApiOperation(value = "전체 평가페이지 조회")
    public List<MentorDto> mentorList(){
        return mentorService.findMentors();
    }

    // 타입별 평가 페이지 조회
    @GetMapping("mentor/{type}")
    @ApiOperation(value = "타입별 전체 평가 페이지 조회")
    public List<MentorDto> mentorTypeList(@PathVariable int type){
        return mentorService.findTypicalMentors(type);
    }

    // 특정 평가페이지 조회
    @GetMapping("mentor/detail/{id}")
    @ApiOperation(value = "특정 평가 페이지 조회")
    public MentorDto mentorDetail(
            @ApiParam(
                    name =  "id",
                    type = "String",
                    value = "평가의 DB상 id",
                    required = true)
            @PathVariable String id){
        return mentorService.findMentor(id);
    }

    // 최근 게시물 조회
    @GetMapping("preview/mentor")
    @ApiOperation(value = "최근 평가 8개 조회")
    public List<MentorDto> mentorRecent(){
        return mentorService.findRecentMentor();
    }

    // 평가 등록
    @PostMapping("mentor/{id}/evaluation")
    @ApiOperation(value = "평가 등록")
    public JSONObject evaluationAdd(@RequestBody EvaluationDto dto, @PathVariable String id){
        JSONObject json = new JSONObject();

        // Token 상의 닉네임 조회
        String email = securityService.findEmail();
        String nickname = userService.findNickname(email);

        String category = filterService.filterContent(dto.getContent());

        dto.setCategory(category);
        dto.setWriter(nickname);

        int statusCode = evaluationService.addEvaluation(dto, id) > 0 ? 200 : 400;

        json.put(STATUS_CODE, statusCode);
        return json;
    }

    // 평가 삭제 --> 관리자 전용 기능
    @DeleteMapping("mentor/{mid}/evaluation/{eid}")
    @ApiOperation(value = "평가 삭제")
    public JSONObject evaluationRemove(@PathVariable String mid, @PathVariable String eid){
        JSONObject json = new JSONObject();

        boolean isAdmin = securityService.isAdmin();

        if(!isAdmin){
            json.put(STATUS_CODE, 400);
        }else {
            int statusCode = evaluationService.removeEvaluation(mid, eid) > 0 ? 200 : 400;
            json.put(STATUS_CODE, statusCode);
        }
        return json;
    }
}
