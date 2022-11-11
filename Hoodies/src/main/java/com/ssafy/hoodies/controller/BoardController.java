package com.ssafy.hoodies.controller;

import com.mongodb.client.result.UpdateResult;
import com.ssafy.hoodies.model.dto.*;
import com.ssafy.hoodies.model.entity.Feedback;
import com.ssafy.hoodies.model.repository.FeedbackRepository;
import com.ssafy.hoodies.model.service.*;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import org.json.simple.JSONObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RequiredArgsConstructor
@RestController
@Api(tags = {"게시판 API"})
@CrossOrigin(origins = "*")
public class BoardController {
    private final MongoTemplate mongoTemplate;
    private final FileService fileService;
    private final FeedbackRepository feedbackRepository;

    //-----------------------------------------
    private final BoardService boardService;
    private final FilterService filterService;
    private final SecurityService securityService;
    private final UserService userService;


    /****************
     *  게시물 CRUD  *
     ****************/

    // Create
    @PostMapping("/board")
    @ApiOperation(value = "게시물 작성")
    public BoardDto boardAdd(@RequestBody BoardRequestDto requestDto){
        String email = securityService.findEmail();
        String writer = userService.findNickname(email);
        String category = filterService.filterBoth(requestDto.getTitle(), requestDto.getContent());
        BoardDto dto = requestDto.toDto();
        dto.setWriter(writer);
        dto.setCategory(category);
        return boardService.addBoard(dto);
    }

    // Retrieve
    // 게시물 조회 --> https://~/api/board?page=0&size=5&sort=id.desc
    @GetMapping("/board/{type}")
    @ApiOperation(value = "유형별 전체 게시물 조회")
    public Page<BoardDto> boardList(Pageable pageable,
                                    @ApiParam(
                                            name = "type",
                                            type = "int",
                                            value = "게시물의 유형",
                                            required = true)
                                    @PathVariable int type){
        return boardService.findBoards(type, pageable);
    }

    // 특정 게시물 조회
    @GetMapping("/board/detail/{id}")
    @ApiOperation(value = "id로 특정 게시물 조회")
    public BoardDto boardDetail(
            @ApiParam(
                    name = "id",
                    type = "String",
                    value = "게시물의 DB상 id",
                    required = true)
            @PathVariable String id){
        return boardService.findBoard(id);
    }

    // Update
    @PutMapping("/board/detail/{id}")
    @ApiOperation(value = "id로 특정 게시물 수정")
    public JSONObject boardModify(@RequestBody BoardRequestDto requestDto,
                                  @ApiParam(
                                          name = "id",
                                          type = "String",
                                          value = "게시물의 DB상 id",
                                          required = true)
                                  @PathVariable String id){
        JSONObject json = new JSONObject();

        // Token 상의 닉네임 조회
        String email = securityService.findEmail();
        String nickname = userService.findNickname(email);

        String category = filterService.filterBoth(requestDto.getTitle(), requestDto.getContent());
        BoardDto dto = requestDto.toDto();
        dto.setCategory(category);
        dto.set_id(id);
        dto.setWriter(nickname);

        int statusCode = boardService.modifyBoard(dto) > 0 ? 200 : 400;

        json.put("statusCode", statusCode);
        return json;
    }

    @PatchMapping("/board/detail/{id}/like")
    @ApiOperation(value = "id로 특정 게시물 좋아요 등록/해제")
    public JSONObject boardLike(@ApiParam(
            name = "id",
            type = "String",
            value = "게시물의 DB상 id",
            required = true)
                                @PathVariable String id) {
        JSONObject json = new JSONObject();

        // Token 상의 닉네임 조회
        String email = securityService.findEmail();
        String nickname = userService.findNickname(email);

        int statusCode = boardService.likeBoard(id, nickname) > 0 ? 200 : 400;

        json.put("statusCode", statusCode);
        return json;
    }

    // 게시물 신고
    @PutMapping("/board/detail/{id}/report")
    @ApiOperation(value = "id로 특정 게시물 신고")
    public JSONObject boardReport(@PathVariable String id) {
        JSONObject json = new JSONObject();

        // Token 상의 닉네임 조회
        String email = securityService.findEmail();
        String nickname = userService.findNickname(email);

        int statusCode = boardService.reportBoard(id, nickname) > 0 ? 200 : 400;

        json.put("statusCode", statusCode);
        return json;
    }

    // Delete
    @DeleteMapping("/board/detail/{id}")
    @ApiOperation(value = "id로 특정 게시물 삭제")
    public JSONObject boardRemove(
            @ApiParam(
                    name = "id",
                    type = "String",
                    value = "게시물의 DB상 id",
                    required = true)
            @PathVariable String id) {
        JSONObject json = new JSONObject();

        // Token 상의 닉네임 조회
        String email = securityService.findEmail();
        String nickname = userService.findNickname(email);
        boolean isAdmin = securityService.isAdmin();
        int statusCode = boardService.removeBoard(id, nickname, isAdmin) > 0 ? 200 : 400;

        json.put("statusCode", statusCode);
        return json;
    }

    // 게시물 10개 조회
    // 최근 게시물 조회
    @GetMapping("/preview/free")
    @ApiOperation(value = "최근 게시물 10개 조회")
    public List<BoardDto> boardRecent() {
        return boardService.findRecentBoard();
    }

    // 인기 게시물 조회
    @GetMapping("/preview/popular")
    @ApiOperation(value = "인기 게시물 10개 조회")
    public List<BoardDto> boardPopular() {
        return boardService.findPopularBoard();
    }
//////////////////////////////////////파일 분리 필요////////////////////////////////////
    @PostMapping("/file/{id}")
    @ApiOperation(value = "파일 업로드")
    public JSONObject uploadFile(@PathVariable String id, MultipartFile file) {
        String filePath = fileService.upload(file);
        JSONObject json = new JSONObject();
        int statusCode = 400;

        // upload에 실패한 경우
        if (filePath.equals("fail")) {
            json.put("statusCode", statusCode);
            return json;
        }

        Query boardQuery = new Query(Criteria.where("_id").is(id));
        Update boardUpdate = new Update();
        boardUpdate.set("filePath", filePath);
        UpdateResult ur = mongoTemplate.updateFirst(boardQuery, boardUpdate, "board");

        // 파일 경로 추가에 실패한 경우
        if (ur.getModifiedCount() == 0) {
            fileService.deleteFile(filePath);
            json.put("statusCode", statusCode);
            return json;
        }

        json.put("filePath", filePath);
        statusCode = 200;
        json.put("statusCode", statusCode);
        return json;
    }

    @PostMapping("/board/feedback")
    @ApiOperation(value = "피드백 작성")
    public JSONObject writeFeedback(@RequestBody FeedbackDto feedbackDto) {
        JSONObject json = new JSONObject();
        int statusCode = 200;

        String email = securityService.findEmail();

        Feedback feedback = feedbackDto.toEntity();
        feedback.setWriter(email);
        feedbackRepository.save(feedback);

        json.put("statusCode", statusCode);
        return json;
    }

    @GetMapping("/admin/feedback")
    @ApiOperation(value = "피드백 조회")
    public List<Feedback> findAllFeedback() {
        Sort sort = Sort.by("createdAt").descending();
        return feedbackRepository.findAll(sort);
    }
}
