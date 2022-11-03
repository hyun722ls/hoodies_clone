package com.ssafy.hoodies.model.repository;

import com.ssafy.hoodies.model.entity.Mentor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MentorRepository extends MongoRepository<Mentor, String> {
    List<Mentor> findBy(Pageable pageable);
    Page<Mentor> findAllByType(int type, Pageable pageable);
}
