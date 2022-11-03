package com.ssafy.hoodies.model.dto;

import com.ssafy.hoodies.model.entity.Evaluation;
import com.ssafy.hoodies.util.util;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.bson.types.ObjectId;

import java.util.HashMap;
import java.util.Map;

@Data
@ApiModel
public class EvaluationDto {
    private String _id;
    @ApiModelProperty(value="작성자")
    private String writer;

    @ApiModelProperty(value="내용")
    private String content;

    private String createdAt;

    private Map<String, Boolean> contributor; // 공감한 사람 목록

    private int like;

    @ApiModelProperty(value="평점")
    private int[] score;

    public Evaluation toEntity(){
        String now = util.getTimeStamp();
        Evaluation evaluation = Evaluation.builder()
                ._id(String.valueOf(new ObjectId()))
                .writer(writer)
                .content(content)
                .createdAt(now)
                .contributor(new HashMap<>())
                .like(0)
                .score(score)
                .build();
        return evaluation;
    }
}
