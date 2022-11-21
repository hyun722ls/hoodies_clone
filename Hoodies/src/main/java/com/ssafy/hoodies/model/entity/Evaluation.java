package com.ssafy.hoodies.model.entity;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class Evaluation {
    private String _id;

    private String writer; // 작성자

    private String content; // 내용

    private String createdAt; // 작성 시간

    private Map<String, Boolean> contributor; // 공감한 사람 목록

    private int like;

    private int[] score; // 평점

    private String category; // 필터링 결과
}
