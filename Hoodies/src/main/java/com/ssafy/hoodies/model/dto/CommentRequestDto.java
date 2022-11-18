package com.ssafy.hoodies.model.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel
public class CommentRequestDto {
    @ApiModelProperty(value="내용")
    private String content;

    @ApiModelProperty(value="게시글 유형", accessMode = ApiModelProperty.AccessMode.READ_ONLY)
    private int type;

    public CommentDto toDto(){
        return CommentDto.builder()
                .content(content)
                .type(type)
                .build();
    }
}
