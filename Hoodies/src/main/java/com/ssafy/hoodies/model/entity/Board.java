package com.ssafy.hoodies.model.entity;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Builder
@Data
@Document(collection = "board")
public class Board {
    @Id
    private String _id;

    private String title;

    private String writer;

    private String content;

    private int hit;

    private int like;

    private String createdAt;

    private String modifiedAt;

    private List<Comment> comments;

    // private ??? image;
}
