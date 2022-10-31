package com.ssafy.hoodies.controller;

import com.ssafy.hoodies.model.dto.BoardDto;
import com.ssafy.hoodies.model.entity.Board;
import com.ssafy.hoodies.model.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
public class BoardController {

    private final BoardRepository boardRepository;

    // 게시물 CRUD
    // create
    @PostMapping("/board")
    public Board save(@RequestBody BoardDto dto){
        return boardRepository.save(dto.toEntity("save"));
    }

    // retrieve
    // 전체 게시물 조회 --> Pagenation 필요 --> PagingAndSortingRepository 참고
    @GetMapping("/board")
    public List<Board> findAll(){
        return boardRepository.findAll();
    }

    // 특정 게시물 조회
    @GetMapping("/board/{id}")
    public Board findById(@PathVariable String id){
        return boardRepository.findById(id).get();
    }

    // update
    @PutMapping("/board/{id}")
    public void update(@RequestBody BoardDto dto, @PathVariable String id){
        Board board = dto.toEntity("update");
        board.set_id(id);
        boardRepository.save(board);
    }

    // delete
    @DeleteMapping("/board/{id}")
    public void deleteById(@PathVariable String id){
        boardRepository.deleteById(id);
    }

    
    // 게시물 10개 조회
    // 최근 게시물 조회
    @GetMapping("/preview/free")
    public List<Board> findByRecent(){
        return boardRepository.findBy(PageRequest.of(0, 10, Sort.by("_id").descending()));
    }
    
    // 인기 게시물 조회
    @GetMapping("/preview/popular")
    public List<Board> findByPopular(){
        return boardRepository.findBy(PageRequest.of(0, 10, Sort.by("like").descending()
                                                                 .and(Sort.by("_id").descending())
                                    ));
    }
}
