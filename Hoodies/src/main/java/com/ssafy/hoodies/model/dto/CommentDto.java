package com.ssafy.hoodies.model.dto;

import com.ssafy.hoodies.model.entity.Comment;
import com.ssafy.hoodies.util.util;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.bson.types.ObjectId;

import java.util.ArrayList;
import java.util.List;

@Data
@ApiModel
public class CommentDto {
    @ApiModelProperty(value="댓글 id", accessMode = ApiModelProperty.AccessMode.READ_ONLY)
    private String _id;
    @ApiModelProperty(value="작성자")
    private String writer;

    @ApiModelProperty(value="내용")
    private String content;

    @ApiModelProperty(value="작성시간", accessMode = ApiModelProperty.AccessMode.READ_ONLY)
    private String createdAt;

    @ApiModelProperty(value="수정시간", accessMode = ApiModelProperty.AccessMode.READ_ONLY)
    private String modifiedAt;

    @ApiModelProperty(value="답글목록", accessMode = ApiModelProperty.AccessMode.READ_ONLY)
    private List<Comment> replies;

    public Comment toEntity(){
        String now = util.getTimeStamp();
        Comment comment = Comment.builder()
                        ._id(String.valueOf(new ObjectId()))
                        .writer(writer)
                        .content(content)
                        .createdAt(now)
                        .modifiedAt(now)
                        .replies(new ArrayList<>())
                        .build();
        return comment;
    }
}
