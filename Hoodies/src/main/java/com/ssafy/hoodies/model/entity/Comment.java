package com.ssafy.hoodies.model.entity;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

import java.util.List;

@Data
@Builder
@ApiModel
public class Comment {
    @ApiModelProperty(value="댓글 id")
    private String id;

    @ApiModelProperty(value="작성자")
    private String userName;

    @ApiModelProperty(value="내용")
    private String content;

    @ApiModelProperty(value="작성시간")
    private String createdAt;

    @ApiModelProperty(value="수정시간")
    private String modifiedAt;

    @ApiModelProperty(value="답글목록")
    private List<Comment> replies;
}
