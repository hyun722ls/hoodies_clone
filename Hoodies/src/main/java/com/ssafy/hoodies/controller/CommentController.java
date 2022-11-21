package com.ssafy.hoodies.controller;

import com.ssafy.hoodies.model.dto.CommentDto;
import com.ssafy.hoodies.model.dto.CommentRequestDto;
import com.ssafy.hoodies.model.service.*;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.json.simple.JSONObject;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@Api(tags = {"댓글 API"})
public class CommentController {
    private final CommentService commentService;
    private final FilterService filterService;
    private final SecurityService securityService;
    private final UserService userService;
    private final static String STATUS_CODE = "statusCode";

    /************
     * 댓글 CRUD *
     ************/
    // 댓글 등록
    @PostMapping("/board/{id}/comment")
    @ApiOperation(value = "댓글 등록")
    public JSONObject commentAdd(@RequestBody CommentRequestDto requestDto, @PathVariable String id) {
        JSONObject json = new JSONObject();

        // Token 상의 닉네임 조회
        String email = securityService.findEmail();
        String nickname = userService.findNickname(email);

        String category = filterService.filterContent(requestDto.getContent());
        CommentDto dto = requestDto.toDto();
        dto.setCategory(category);
        dto.setWriter(nickname);

        int statusCode = commentService.addComment(dto, id) > 0 ? 200 : 400;

        json.put(STATUS_CODE, statusCode);
        return json;
    }

    // 댓글 수정
    @PutMapping("/board/{bid}/comment/{cid}")
    @ApiOperation(value = "댓글 수정")
    public JSONObject commentModify(@RequestBody CommentRequestDto requestDto, @PathVariable String bid, @PathVariable String cid) {
        JSONObject json = new JSONObject();

        // Token 상의 닉네임 조회
        String email = securityService.findEmail();
        String nickname = userService.findNickname(email);

        String category = filterService.filterContent(requestDto.getContent());
        CommentDto dto = requestDto.toDto();
        dto.set_id(cid);
        dto.setCategory(category);
        dto.setWriter(nickname);

        int statusCode = commentService.modifyComment(dto, bid) > 0 ? 200 : 400;

        json.put(STATUS_CODE, statusCode);
        return json;
    }

    // 댓글 삭제
    @DeleteMapping("/board/{bid}/comment/{cid}")
    @ApiOperation(value = "댓글 삭제")
    public JSONObject commentRemove(@PathVariable String bid, @PathVariable String cid) {
        JSONObject json = new JSONObject();

        // Token 상의 닉네임 조회
        String email = securityService.findEmail();
        String nickname = userService.findNickname(email);
        boolean isAdmin = securityService.isAdmin();

        int statusCode = commentService.removeComment(bid, cid, nickname, isAdmin) > 0 ? 200 : 400;

        json.put(STATUS_CODE, statusCode);
        return json;
    }

    // 댓글 신고
    @PutMapping("/board/{bid}/comment/{cid}/report")
    @ApiOperation(value = "댓글 신고")
    public JSONObject commentReport(@PathVariable String bid, @PathVariable String cid) {
        JSONObject json = new JSONObject();

        // Token 상의 닉네임 조회
        String email = securityService.findEmail();
        String nickname = userService.findNickname(email);

        int statusCode = commentService.reportComment(bid, cid, nickname) > 0 ? 200 : 400;

        json.put(STATUS_CODE, statusCode);
        return json;
    }
}
