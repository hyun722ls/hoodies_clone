package com.ssafy.hoodies.model.entity;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Builder
@Data
@Document(collection = "board")
@ApiModel
public class Board {
    @Id
    @ApiModelProperty(value="게시글 id")
    private String _id;

    @ApiModelProperty(value="제목")
    private String title;

    @ApiModelProperty(value="작성자")
    private String userName;

    @ApiModelProperty(value="내용")
    private String content;

    @ApiModelProperty(value="조회수")
    private int hit;

    @ApiModelProperty(value="좋아요수")
    private int like;

    @ApiModelProperty(value="작성시간")
    private String createdAt;

    @ApiModelProperty(value="수정시간")
    private String modifiedAt;

    @ApiModelProperty(value="댓글목록")
    private List<Comment> comments;

    // private ??? image;
}
