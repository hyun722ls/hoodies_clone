package com.ssafy.hoodies.model.entity;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Set;

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

    private Set<String> reporter;
}
