package com.ssafy.hoodies.model.dto;

import com.ssafy.hoodies.model.entity.Evaluation;
import com.ssafy.hoodies.util.util;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.bson.types.ObjectId;

import java.util.HashMap;

@Getter
@Setter
@Builder
@ApiModel
public class EvaluationDto {
    @ApiModelProperty(value="작성자")
    private String writer;
    @ApiModelProperty(value="내용")
    private String content;
    @ApiModelProperty(value="평점")
    private int[] score;
    private String category; // 필터링 결과

    public Evaluation toEntity(){
        String now = util.getTimeStamp();
        return Evaluation.builder()
                ._id(String.valueOf(new ObjectId()))
                .writer(writer)
                .content(content)
                .createdAt(now)
                .contributor(new HashMap<>())
                .like(0)
                .score(score)
                .category(category)
                .build();
    }
}
