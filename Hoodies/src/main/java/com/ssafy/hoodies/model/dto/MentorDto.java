package com.ssafy.hoodies.model.dto;

import com.ssafy.hoodies.model.entity.Evaluation;
import com.ssafy.hoodies.model.entity.Mentor;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
@ApiModel
public class MentorDto {
    @ApiModelProperty(value="평가게시판 id")
    private String _id;

    @ApiModelProperty(value="성명")
    private String writer; // 성명

    @ApiModelProperty(value="이메일")
    private String email; // 이메일

    @ApiModelProperty(value="경력사항")
    private List<String> career; // 경력사항

    @ApiModelProperty(value="기타정보")
    private String etc; // 기타정보

    @ApiModelProperty(value="역할")
    private int type; // 역할

    @ApiModelProperty(value="평균평점")
    private double[] averageScores; // 평균평점

    @ApiModelProperty(value="업데이트 시간")
    private String modifiedAt; // 업데이트 시간

//    @ApiModelProperty(value="평가자 목록")
//    private List<String> contributor; // 평가자 목록

    @ApiModelProperty(value="평가 목록")
    private List<Evaluation> evaluations; // 평가 목록

    public static MentorDto fromEntity(Mentor mentor){
        return MentorDto.builder()
                        ._id(mentor.get_id())
                        .writer(mentor.getWriter())
                        .email(mentor.getEmail())
                        .career(mentor.getCareer())
                        .etc(mentor.getEtc())
                        .type(mentor.getType())
                        .averageScores(mentor.getAverageScores())
                        .modifiedAt(mentor.getModifiedAt())
                        .evaluations(mentor.getEvaluations())
                        .build();
    }
}
