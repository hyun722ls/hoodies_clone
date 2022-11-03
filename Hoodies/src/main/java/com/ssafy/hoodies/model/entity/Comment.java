package com.ssafy.hoodies.model.entity;

import lombok.*;
import org.springframework.data.annotation.Id;

import java.util.List;

@Data
@Builder
public class Comment {
    private String _id;

    private String writer;

    private String content;

    private String createdAt;

    private String modifiedAt;

    private List<Comment> replies;

    private String category;

    private int type;
}
