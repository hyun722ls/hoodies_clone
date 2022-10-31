package com.ssafy.hoodies.model.dto;

import com.ssafy.hoodies.model.entity.Evaluation;
import com.ssafy.hoodies.util.util;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.bson.types.ObjectId;

import java.util.ArrayList;
import java.util.List;

@Data
@ApiModel
public class EvaluationDto {
    @ApiModelProperty(value="댓글 id", accessMode = ApiModelProperty.AccessMode.READ_ONLY)
    private String _id;
    @ApiModelProperty(value="작성자")
    private String writer;

    @ApiModelProperty(value="내용")
    private String content;

    @ApiModelProperty(value="작성시간", accessMode = ApiModelProperty.AccessMode.READ_ONLY)
    private String createdAt;

    //    private List<String> like; // 공감한 사람 목록
    @ApiModelProperty(value="공감", accessMode = ApiModelProperty.AccessMode.READ_ONLY)
    private int like;

    //    private List<String> dislike; // 싫어한 사람 목록
    @ApiModelProperty(value="비공감", accessMode = ApiModelProperty.AccessMode.READ_ONLY)
    private int dislike;

    @ApiModelProperty(value="평점")
    private int[] score;

    public Evaluation toEntity(){
        String now = util.getTimeStamp();
        Evaluation evaluation = Evaluation.builder()
                ._id(String.valueOf(new ObjectId()))
                .writer(writer)
                .content(content)
                .createdAt(now)
                .like(0)
                .dislike(0)
                .score(score)
                .build();
        return evaluation;
    }
}
