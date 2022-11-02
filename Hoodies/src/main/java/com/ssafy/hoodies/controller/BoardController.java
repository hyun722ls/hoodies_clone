package com.ssafy.hoodies.controller;

import com.mongodb.client.result.UpdateResult;
import com.ssafy.hoodies.model.BoardType;
import com.ssafy.hoodies.model.dto.BoardDto;
import com.ssafy.hoodies.model.dto.CommentDto;
import com.ssafy.hoodies.model.entity.Board;
import com.ssafy.hoodies.model.entity.Comment;
import com.ssafy.hoodies.model.repository.BoardRepository;
import com.ssafy.hoodies.util.util;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import org.json.simple.JSONObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@Api(tags = {"게시판 API"})
@CrossOrigin(origins = "*")
public class BoardController {

    private final BoardRepository boardRepository;
    private final MongoTemplate mongoTemplate;


//    private static final int PAGE_SIZE = 10; // 한 페이지의 게시물 수

    /****************
     *  게시물 CRUD  *
     ****************/
    // Create
    @PostMapping("/board")
    @ApiOperation(value = "게시물 작성")
    public Board writeBoard(@RequestBody BoardDto dto){
        ResponseEntity<String> res = util.checkExpression(dto.getTitle(), dto.getContent(), "article");
        Board board = dto.toEntity();
        board.setCategory(res.getBody().trim());
        switch(BoardType.convert(dto.getType())){
            case FREE: // 자유게시판
                System.out.println("FREE");
                break;
            case ANON: // 익명게시판
                System.out.println("ANON");
                // 닉네임 해시화 필요
                // hash(dto.getwriter());
                // board.setwriter();
                break;
        }
        return boardRepository.save(board);
    }

    // Retrieve
    // 게시물 조회 --> https://~/api/board?page=0&size=5&sort=id.desc
    @GetMapping("/board/{type}")
    @ApiOperation(value = "유형별 전체 게시물 조회")
    public Page<Board> findAllBoard(Pageable pageable,
                                    @ApiParam(
                                            name =  "type",
                                            type = "int",
                                            value = "게시물의 유형",
                                            required = true)
                                    @PathVariable int type){
        Sort sort = Sort.by("createdAt").descending();
        return boardRepository.findAllByType(type, PageRequest.of(pageable.getPageNumber()-1, pageable.getPageSize(), sort));
    }

    // 특정 게시물 조회
    @GetMapping("/board/detail/{id}")
    @ApiOperation(value = "id로 특정 게시물 조회")
    public Board findCertainBoard(
            @ApiParam(
            name =  "id",
            type = "String",
            value = "게시물의 DB상 id",
            required = true)
            @PathVariable String id){
        FindAndModifyOptions findAndModifyOptions = FindAndModifyOptions.options().returnNew(true);
        Query boardQuery = new Query(Criteria.where("_id").is(id));
        Update boardUpdate = new Update().inc("hit", 1);
        return mongoTemplate.findAndModify(boardQuery, boardUpdate, findAndModifyOptions, Board.class);
    }

    // Update
    @PutMapping("/board/detail/{id}")
    @ApiOperation(value = "id로 특정 게시물 수정")
    public JSONObject updateBoard(@RequestBody BoardDto dto,
                            @ApiParam(
                                    name =  "id",
                                    type = "String",
                                    value = "게시물의 DB상 id",
                                    required = true)
                            @PathVariable String id){
        ResponseEntity<String> res = util.checkExpression(dto.getTitle(), dto.getContent(), "article");
        Query boardQuery = new Query(Criteria.where("_id").is(id));
        Update boardUpdate = new Update();
        boardUpdate.set("title", dto.getTitle());
        boardUpdate.set("content", dto.getContent());
        boardUpdate.set("category", res.getBody().trim());
        boardUpdate.set("modifiedAt", util.getTimeStamp());
        UpdateResult ur = mongoTemplate.updateFirst(boardQuery, boardUpdate, "board");

        int statusCode = ur.getModifiedCount() > 0 ? 200 : 400;
        JSONObject json = new JSONObject();
        json.put("statusCode", statusCode);
        return json;
    }

    @PatchMapping("/board/detail/{id}/like/{user}")
    @ApiOperation(value = "id로 특정 게시물 좋아요 등록/해제")
    public JSONObject likeBoard(@ApiParam(
                                        name =  "id",
                                        type = "String",
                                        value = "게시물의 DB상 id",
                                        required = true)
                                @PathVariable String id,
                                @PathVariable String user){
        // 목록에 있으면 -1, 목록에 없거나 취소한 인원이면 +1
        // 작성자 인코딩 필요
        Map<String, Boolean> contributor = boardRepository.findById(id).get().getContributor();
        boolean value = contributor.getOrDefault(user, false);
        int diff = value ? -1 : +1;
        contributor.put(user, !value);

        Query boardQuery = new Query(Criteria.where("_id").is(id));
        Update boardUpdate = new Update();
        boardUpdate.set("contributor", contributor);
        boardUpdate.inc("like", diff);
        UpdateResult ur = mongoTemplate.updateFirst(boardQuery, boardUpdate, "board");

        int statusCode = ur.getModifiedCount() > 0 ? 200 : 400;
        JSONObject json = new JSONObject();
        json.put("statusCode", statusCode);
        return json;
    }

    // Delete
    @DeleteMapping("/board/detail/{id}")
    @ApiOperation(value = "id로 특정 게시물 삭제")
    public JSONObject deleteBoard(
            @ApiParam(
                    name =  "id",
                    type = "String",
                    value = "게시물의 DB상 id",
                    required = true)
            @PathVariable String id){
        boolean isExist = boardRepository.existsById(id);
        boardRepository.deleteById(id);

        int statusCode = isExist ? 200 : 400;
        JSONObject json = new JSONObject();
        json.put("statusCode", statusCode);
        map
                map.put("jsonObjec")
        return json;
    }
    
    // 게시물 10개 조회
    // 최근 게시물 조회
    @GetMapping("/preview/free")
    @ApiOperation(value = "최근 게시물 10개 조회")
    public List<Board> findRecentBoard(){
        return boardRepository.findBy(PageRequest.of(0, 10, Sort.by("createdAt").descending()));
    }
    
    // 인기 게시물 조회
    @GetMapping("/preview/popular")
    @ApiOperation(value = "인기 게시물 10개 조회")
    public List<Board> findPopularBoard(){
        return boardRepository.findBy(PageRequest.of(0, 10, Sort.by("like").descending()
                                                                 .and(Sort.by("createdAt").descending())
                                    ));
    }
    /************
     * 댓글 CRUD *
     ************/
    // 댓글 등록
    @PostMapping("/board/{id}/comment")
    @ApiOperation(value = "댓글 등록")
    public JSONObject writeComment(@RequestBody CommentDto dto, @PathVariable String id){
        ResponseEntity<String> res = util.checkExpression("", dto.getContent(), "comment");
        Comment comment = dto.toEntity();
        comment.setCategory(res.getBody().trim());
        Query commentQuery = new Query(Criteria.where("_id").is(id));
        Update commentUpdate = new Update();
        commentUpdate.push("comments", comment);

        UpdateResult ur = mongoTemplate.updateFirst(commentQuery, commentUpdate, "board");

        int statusCode = ur.getModifiedCount() > 0 ? 200 : 400;
        JSONObject json = new JSONObject();
        json.put("statusCode", statusCode);
        return json;
    }

    // 댓글 수정
    @PutMapping("/board/{bid}/comment/{cid}")
    @ApiOperation(value = "댓글 수정")
    public JSONObject updateComment(@RequestBody CommentDto dto, @PathVariable String bid, @PathVariable String cid){
        ResponseEntity<String> res = util.checkExpression("", dto.getContent(), "comment");
        Query commentQuery = new Query();
        commentQuery.addCriteria(Criteria.where("_id").is(bid));
        commentQuery.addCriteria(Criteria.where("comments").elemMatch(Criteria.where("_id").is(cid)));
        Update commentUpdate = new Update();
        commentUpdate.set("comments.$.content", dto.getContent());
        commentUpdate.set("comments.$.modifiedAt", util.getTimeStamp());
        commentUpdate.set("comments.$.category", res.getBody().trim());

        UpdateResult ur = mongoTemplate.updateFirst(commentQuery, commentUpdate, "board");

        int statusCode = ur.getModifiedCount() > 0 ? 200 : 400;
        JSONObject json = new JSONObject();
        json.put("statusCode", statusCode);
        json.put("viewFlag", true);
        return json;
    }

    // 댓글 삭제
    @DeleteMapping("/board/{bid}/comment/{cid}")
    @ApiOperation(value = "댓글 삭제")
    public JSONObject deleteComment(@PathVariable String bid, @PathVariable String cid){
        Query commentQuery = new Query();
        commentQuery.addCriteria(Criteria.where("_id").is(bid));
        commentQuery.addCriteria(Criteria.where("comments").elemMatch(Criteria.where("_id").is(cid)));
        Update commentUpdate = new Update();
        commentUpdate.pull("comments", Query.query(Criteria.where("_id").is(cid)));

        UpdateResult ur = mongoTemplate.updateFirst(commentQuery, commentUpdate, "board");

        int statusCode = ur.getModifiedCount() > 0 ? 200 : 400;
        JSONObject json = new JSONObject();
        json.put("statusCode", statusCode);
        return json;
    }


}
