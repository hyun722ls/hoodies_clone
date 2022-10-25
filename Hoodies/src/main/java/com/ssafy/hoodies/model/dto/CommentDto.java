package com.ssafy.hoodies.model.dto;

import com.ssafy.hoodies.model.entity.Comment;
import com.ssafy.hoodies.util.util;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class CommentDto {
    private String id;
    private String userName;

    private String content;

    private String createdAt;

    private String modifiedAt;

    private List<Comment> replies;

    public Comment toEntity(String usage){
        String now = util.getTimeStamp();
        Comment comment;
        if("write comment".equals(usage)){ // 게시글 등록
            comment = Comment.builder()
                    .userName(userName)
                    .content(content)
                    .createdAt(now)
                    .modifiedAt(now)
                    .replies(new ArrayList<>())
                    .build();
        }else if("update comment".equals(usage)){ // 게시글 수정
            comment = Comment.builder()
                    .id(id)
                    .userName(userName)
                    .content(content)
                    .createdAt(createdAt)
                    .modifiedAt(now)
                    .replies(replies)
                    .build();
        }else{
            comment = null;
        }
        return comment;
    }
}
