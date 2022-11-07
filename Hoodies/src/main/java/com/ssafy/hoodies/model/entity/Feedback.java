package com.ssafy.hoodies.model.entity;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@Document(collection = "feedback")
public class Feedback {
    private String _id;

    private String writer;

    private String content;

    private String createdAt;

}
