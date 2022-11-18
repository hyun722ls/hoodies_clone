package com.ssafy.hoodies.model.repository;


import com.ssafy.hoodies.model.entity.Feedback;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FeedbackRepository extends MongoRepository<Feedback, String> {
}
