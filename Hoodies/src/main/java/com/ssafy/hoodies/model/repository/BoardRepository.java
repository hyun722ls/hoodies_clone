package com.ssafy.hoodies.model.repository;

import com.ssafy.hoodies.model.entity.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BoardRepository extends MongoRepository<Board, String> {
    List<Board> findBy(Pageable pageable);
    Page<Board> findAllByType(int type, Pageable pageable);
    List<Board> findAllByType(int type);
}
