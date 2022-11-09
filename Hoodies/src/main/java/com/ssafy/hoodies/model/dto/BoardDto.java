package com.ssafy.hoodies.model.dto;

import com.ssafy.hoodies.model.entity.Board;
import com.ssafy.hoodies.model.entity.Comment;
import com.ssafy.hoodies.util.util;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.*;

@Getter
@Setter
@Builder
@ApiModel
public class BoardDto {
    private String _id;
    @ApiModelProperty(value="제목")
    private String title;
    @ApiModelProperty(value="작성자")
    private String writer;
    @ApiModelProperty(value="내용")
    private String content;
    @ApiModelProperty(value="게시글 유형", accessMode = ApiModelProperty.AccessMode.READ_ONLY)
    private int type;
    @ApiModelProperty(value="필터 결과", accessMode = ApiModelProperty.AccessMode.READ_ONLY)
    private String category;

    private int hit;

    private int like;

    private String createdAt;

    private String modifiedAt;

    private List<Comment> comments;

    private Map<String, Boolean> contributor;
    private Set<String> reporter;

    public Board toEntity() {
        String now = util.getTimeStamp();
        return Board.builder()
                    .writer(writer)
                    .title(title)
                    .content(content)
                    .type(type)
                    .category(category)
                    .hit(0)
                    .like(0)
                    .createdAt(now)
                    .modifiedAt(now)
                    .comments(new ArrayList<>())
                    .contributor(new HashMap<String, Boolean>())
                    .reporter(new HashSet<>())
                    .build();
    }

    public static BoardDto fromEntity(Board board){
        return BoardDto.builder()
                       ._id(board.get_id())
                       .writer(board.getWriter())
                       .title(board.getTitle())
                       .content(board.getContent())
                       .type(board.getType())
                       .category(board.getCategory())
                       .hit(board.getHit())
                       .like(board.getLike())
                       .createdAt(board.getCreatedAt())
                       .modifiedAt(board.getModifiedAt())
                       .comments(board.getComments())
                       .contributor(board.getContributor())
                       .reporter(board.getReporter())
                       .build();
    }
}
