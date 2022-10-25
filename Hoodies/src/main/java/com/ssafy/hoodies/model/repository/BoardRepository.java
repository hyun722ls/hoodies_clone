package com.ssafy.hoodies.model.repository;


import com.ssafy.hoodies.model.model.Board;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BoardRepository extends MongoRepository<Board, String> {
    List<Board> findBy(Pageable pageable);
}
