package com.ssafy.hoodies.controller;

import com.ssafy.hoodies.model.dto.BoardDto;
import com.ssafy.hoodies.model.dto.CommentDto;
import com.ssafy.hoodies.model.entity.Board;
import com.ssafy.hoodies.model.entity.Comment;
import com.ssafy.hoodies.model.repository.BoardRepository;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
@Api(tags = {"게시판 API"})
public class BoardController {

    private final BoardRepository boardRepository;

    /****************
     *  게시물 CRUD  *
     ****************/
    // Create
    @PostMapping("board")
    @ApiOperation(value = "게시물 작성")
    public Board writeBoard(@RequestBody BoardDto dto){
        return boardRepository.save(dto.toEntity("write board"));
    }

    // Retrieve
    // 전체 게시물 조회 --> Pagenation 필요 --> PagingAndSortingRepository 참고
    @GetMapping("board")
    @ApiOperation(value = "전체 게시물 조회")
    public List<Board> findAllBoard(){
        return boardRepository.findAll();
    }

    // 특정 게시물 조회
    @GetMapping("board/{id}")
    @ApiOperation(value = "특정 게시물 조회")
    public Board findCertainBoard(@PathVariable String id){
        return boardRepository.findById(id).get();
    }

    // Update
    @PutMapping("board/{id}")
    @ApiOperation(value = "특정 게시물 수정")
    public void updateBoard(@RequestBody BoardDto dto, @PathVariable String id){
        Board board = dto.toEntity("update board");
        board.set_id(id);
        boardRepository.save(board);
    }

    // Delete
    @DeleteMapping("board/{id}")
    @ApiOperation(value = "특정 게시물 삭제")
    public void deleteBoard(@PathVariable String id){
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
    public Board writeComment(@RequestBody CommentDto dto, @PathVariable String id){
        Board board = boardRepository.findById(id).get();
        List<Comment> comments = board.getComments();
        Comment comment = dto.toEntity("write comment");
        int newId = comments.size() > 0 ? Integer.parseInt(comments.get(comments.size()-1).getId()) : 0;
        comment.setId(Integer.toString(newId+1));
        comments.add(comment);
        board.setComments(comments);
        return boardRepository.save(board);
    }

    // 댓글 수정
    @PutMapping("board/{id}/comment")
    @ApiOperation(value = "댓글 수정")
    public void updateComment(@RequestBody CommentDto dto, @PathVariable String id){
        Board board = boardRepository.findById(id).get();
        List<Comment> comments = board.getComments();
        Comment comment = dto.toEntity("update comment");
        String cid = comment.getId();
        for(int i=0; i<comments.size(); ++i){
            if(cid.equals(comments.get(i).getId())){
                comments.set(i, comment);
                break;
            }
        }
        board.setComments(comments);
        boardRepository.save(board);
    }

    // 댓글 삭제
    @DeleteMapping("board/{bid}/comment/{cid}")
    @ApiOperation(value = "댓글 삭제")
    public void deleteComment(@PathVariable String bid, @PathVariable String cid){
        Board board = boardRepository.findById(bid).get();
        List<Comment> comments = board.getComments();
        for(int i=0; i<comments.size(); ++i){
            if(cid.equals(comments.get(i).getId())){
                comments.remove(i);
                break;
            }
        }
        board.setComments(comments);
        boardRepository.save(board);
    }


}
