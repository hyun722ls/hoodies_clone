package com.ssafy.hoodies.model.dto;

import com.ssafy.hoodies.model.entity.Board;
import com.ssafy.hoodies.model.entity.Comment;
import com.ssafy.hoodies.util.util;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class BoardDto {

    private String title;
    private String userName;
    private String content;
    private int hit;
    private int like;
    private String createdAt;
    private String modifiedAt;
    private List<Comment> comments;
    // private ??? image;

    public Board toEntity(String usage) {
        String now = util.getTimeStamp();
        Board board;
        if("write board".equals(usage)){ // 게시글 등록
            board = Board.builder()
                    .title(title)
                    .userName(userName)
                    .content(content)
                    .hit(0)
                    .like(0)
                    .createdAt(now)
                    .modifiedAt(now)
                    .comments(new ArrayList<>())
                    .build();
        }else if("update board".equals(usage)){ // 게시글 수정
            board = Board.builder()
                    .title(title)
                    .userName(userName)
                    .content(content)
                    .hit(hit)
                    .like(like)
                    .createdAt(createdAt)
                    .modifiedAt(now)
                    .comments(comments)
                    .build();
        }else{
            board = null;
        }
        // board.setImage(image);

        return board;
    }

}
