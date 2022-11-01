package com.ssafy.hoodies.model.repository;


import com.ssafy.hoodies.model.entity.Board;
import com.ssafy.hoodies.model.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface BoardRepository extends MongoRepository<Board, String> {
    List<Board> findBy(Pageable pageable);
    Page<Board> findByWriter(String writer, Pageable pageable);
}
