package com.ssafy.hoodies.model.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel
public class BoardRequestDto {
    @ApiModelProperty(value="제목")
    private String title;

    @ApiModelProperty(value="내용")
    private String content;

    @ApiModelProperty(value="게시글 유형", accessMode = ApiModelProperty.AccessMode.READ_ONLY)
    private int type;

    public BoardDto toDto(){
        return BoardDto.builder()
                .title(title)
                .content(content)
                .type(type)
                .build();
    }
}
