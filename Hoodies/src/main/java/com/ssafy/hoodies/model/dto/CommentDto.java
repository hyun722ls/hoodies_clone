package com.ssafy.hoodies.model.dto;

import com.ssafy.hoodies.model.entity.Comment;
import com.ssafy.hoodies.util.util;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.bson.types.ObjectId;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Builder
@ApiModel
public class CommentDto {
    @ApiModelProperty(value="댓글 id", accessMode = ApiModelProperty.AccessMode.READ_ONLY)
    private String _id;
    @ApiModelProperty(value="작성자")
    private String writer;
    @ApiModelProperty(value="내용")
    private String content;
    @ApiModelProperty(value="게시판 유형")
    private int type;
    @ApiModelProperty(value="필터 결과")
    private String category;

    @ApiModelProperty(value="작성시간")
    private String createdAt;

    @ApiModelProperty(value="수정시간")
    private String modifiedAt;

    @ApiModelProperty(value="답글 목록")
    private List<Comment> replies;

    @ApiModelProperty(value="신고자 목록")
    private Set<String> reporter;

    public Comment toEntity(){
        String now = util.getTimeStamp();
        return Comment.builder()
                        ._id(String.valueOf(new ObjectId()))
                        .writer(writer)
                        .content(content)
                        .type(type)
                        .category(category)
                        .createdAt(now)
                        .modifiedAt(now)
                        .replies(new ArrayList<>())
                        .reporter(new HashSet<>())
                        .build();
    }

    public static CommentDto fromEntity(Comment comment){
        return CommentDto.builder()
                         ._id(comment.get_id())
                         .writer(comment.getWriter())
                         .content(comment.getContent())
                         .type(comment.getType())
                         .category(comment.getCategory())
                         .createdAt(comment.getCreatedAt())
                         .modifiedAt(comment.getModifiedAt())
                         .replies(comment.getReplies())
                         .reporter(comment.getReporter())
                         .build();
    }
}
