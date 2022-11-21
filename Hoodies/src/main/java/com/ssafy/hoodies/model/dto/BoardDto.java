package com.ssafy.hoodies.model.dto;

import com.ssafy.hoodies.model.entity.Board;
import com.ssafy.hoodies.model.entity.Comment;
import com.ssafy.hoodies.util.util;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.*;

@Getter
@Setter
@Builder
@ApiModel
public class BoardDto {
    @ApiModelProperty(value="게시글 id")
    private String _id;
    @ApiModelProperty(value="제목")
    private String title;
    @ApiModelProperty(value="작성자")
    private String writer;
    @ApiModelProperty(value="내용")
    private String content;
    @ApiModelProperty(value="게시판 유형")
    private int type;
    @ApiModelProperty(value="필터 결과")
    private String category;

    @ApiModelProperty(value="조회수")
    private int hit;

    @ApiModelProperty(value="좋아요 수")
    private int like;

    @ApiModelProperty(value="작성시간")
    private String createdAt;

    @ApiModelProperty(value="수정시간")
    private String modifiedAt;

    @ApiModelProperty(value="댓글목록")
    private List<Comment> comments;

    @ApiModelProperty(value="좋아요 목록")
    private Map<String, Boolean> contributor;

    @ApiModelProperty(value="신고자 목록")
    private Set<String> reporter;
    private List<String> filePaths;

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
                    .contributor(new HashMap<>())
                    .reporter(new HashSet<>())
                    .filePaths(new ArrayList<>())
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
                       .filePaths(board.getFilePaths())
                       .build();
    }
}
