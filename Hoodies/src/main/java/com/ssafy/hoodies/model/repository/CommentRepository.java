package com.ssafy.hoodies.model.repository;

import com.ssafy.hoodies.model.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CommentRepository extends MongoRepository<Comment, String> {

}
