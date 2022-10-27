package com.ssafy.hoodies.model.dto;

import com.ssafy.hoodies.model.entity.Board;
import com.ssafy.hoodies.model.entity.Comment;
import com.ssafy.hoodies.util.util;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@ApiModel
public class BoardDto {

    @ApiModelProperty(value="제목")
    private String title;
    @ApiModelProperty(value="작성자")
    private String writer;
    @ApiModelProperty(value="내용")
    private String content;
    @ApiModelProperty(value="조회수", accessMode = ApiModelProperty.AccessMode.READ_ONLY)
    private int hit;
    @ApiModelProperty(value="좋아요수", accessMode = ApiModelProperty.AccessMode.READ_ONLY)
    private int like;
    @ApiModelProperty(value="작성시간", accessMode = ApiModelProperty.AccessMode.READ_ONLY)
    private String createdAt;

    @ApiModelProperty(value="수정시간", accessMode = ApiModelProperty.AccessMode.READ_ONLY)
    private String modifiedAt;
    @ApiModelProperty(value="댓글목록", accessMode = ApiModelProperty.AccessMode.READ_ONLY)
    private List<Comment> comments;
    // private ??? image;

    public Board toEntity() {
        String now = util.getTimeStamp();
        Board board = Board.builder()
                        .title(title)
                        .writer(writer)
                        .content(content)
                        .hit(0)
                        .like(0)
                        .createdAt(now)
                        .modifiedAt(now)
                        .comments(new ArrayList<>())
                        .build();
        // board.setImage(image);
        return board;
    }

}
