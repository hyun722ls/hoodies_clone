package com.ssafy.hoodies.model.entity;


import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Builder
@Data
@Document(collection = "mentor")
public class Mentor {
    @Id
    private String _id;

    private String writer; // 성명

    private String email; // 이메일

    private String career; // 경력사항

    private String etc; // 기타정보

    private String type; // 역할

    private double[] scores; // 평균평점

    private String modifiedAt; // 수정 시간

    private List<String> contributor; // 평가자 목록

    private List<Evaluation> evaluations; // 평가 목록
}
