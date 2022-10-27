package com.ssafy.hoodies.controller;

import com.mongodb.BasicDBObject;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
@Api(tags = {"게시판 API"})
public class BoardController {

    private final BoardRepository boardRepository;
    private final MongoTemplate mongoTemplate;
//    private static final int PAGE_SIZE = 10; // 한 페이지의 게시물 수

    /****************
     *  게시물 CRUD  *
     ****************/
    // Create
    @PostMapping("board")
    @ApiOperation(value = "게시물 작성")
    public Board writeBoard(@RequestBody BoardDto dto){
        return boardRepository.save(dto.toEntity());
    }

    // Retrieve
    // 게시물 조회 --> https://~/api/board?page=0&size=5&sort=id.desc
    @GetMapping("board")
    @ApiOperation(value = "전체 게시물 조회")
    public Page<Board> findAllBoard(Pageable pageable){ return boardRepository.findAll(pageable); }

    // 특정 게시물 조회
    @GetMapping("board/{id}")
    @ApiOperation(value = "특정 게시물 조회")
    public Board findCertainBoard(
            @ApiParam(
            name =  "id",
            type = "String",
            value = "게시물의 DB상 id",
            required = true)
            @PathVariable String id){
        return boardRepository.findById(id).get();
    }

    // Update
    @PutMapping("board/{id}")
    @ApiOperation(value = "특정 게시물 수정")
    public void updateBoard(@RequestBody BoardDto dto,
                            @ApiParam(
                                    name =  "id",
                                    type = "String",
                                    value = "게시물의 DB상 id",
                                    required = true)
                            @PathVariable String id){
        Query boardQuery = new Query(Criteria.where("_id").is(id));
        Update boardUpdate = new Update();
        boardUpdate.set("title", dto.getTitle());
        boardUpdate.set("content", dto.getContent());
        boardUpdate.set("modifiedAt", util.getTimeStamp());
        mongoTemplate.updateFirst(boardQuery, boardUpdate, "board");
    }

    // Delete
    @DeleteMapping("board/{id}")
    @ApiOperation(value = "특정 게시물 삭제")
    public void deleteBoard(
            @ApiParam(
                    name =  "id",
                    type = "String",
                    value = "게시물의 DB상 id",
                    required = true)
            @PathVariable String id){
        boardRepository.deleteById(id);
    }
    
    // 게시물 10개 조회
    // 최근 게시물 조회
    @GetMapping("preview/free")
    @ApiOperation(value = "최근 게시물 10개 조회")
    public List<Board> findRecentBoard(){
        return boardRepository.findBy(PageRequest.of(0, 10, Sort.by("_id").descending()));
    }
    
    // 인기 게시물 조회
    @GetMapping("preview/popular")
    @ApiOperation(value = "인기 게시물 10개 조회")
    public List<Board> findPopularBoard(){
        return boardRepository.findBy(PageRequest.of(0, 10, Sort.by("like").descending()
                                                                 .and(Sort.by("_id").descending())
                                    ));
    }
    /************
     * 댓글 CRUD *
     ************/
    // 댓글 등록
    @PostMapping("board/{id}/comment")
    @ApiOperation(value = "댓글 등록")
    public void writeComment(@RequestBody CommentDto dto, @PathVariable String id){
        Comment comment = dto.toEntity();
        Query commentQuery = new Query(Criteria.where("_id").is(id));;
        Update commentUpdate = new Update();
        commentUpdate.push("comments", comment);
        mongoTemplate.updateFirst(commentQuery, commentUpdate, "board");
    }

    // 댓글 수정
    @PutMapping("board/{bid}/comment/{cid}")
    @ApiOperation(value = "댓글 수정")
    public void updateComment(@RequestBody CommentDto dto, @PathVariable String bid, @PathVariable String cid){
        Query commentQuery = new Query(Criteria.where("_id").is(bid).and("comments.id").is(cid));
        Update commentUpdate = new Update();
        commentUpdate.set("comments.$.content", dto.getContent());
        commentUpdate.set("comments.$.modifiedAt", util.getTimeStamp());
        System.out.println(commentQuery);
        System.out.println(commentUpdate);
        System.out.println(mongoTemplate.updateFirst(commentQuery, commentUpdate, "board"));
    }

    // 댓글 삭제
    @DeleteMapping("board/{bid}/comment/{cid}")
    @ApiOperation(value = "댓글 삭제")
    public void deleteComment(@PathVariable String bid, @PathVariable String cid){
        Query commentQuery = new Query(Criteria.where("_id").is(bid));
        Update commentUpdate = new Update();
        commentUpdate.pull("comments", new BasicDBObject("id",cid));
        mongoTemplate.updateFirst(commentQuery, commentUpdate, "board");
    }


}
