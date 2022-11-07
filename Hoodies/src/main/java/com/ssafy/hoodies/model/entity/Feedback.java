package com.ssafy.hoodies.model.entity;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Feedback {
    private String _id;

    private String writer;

    private String content;

    private String createdAt;

}
