package com.ssafy.hoodies.model.dto;

import com.ssafy.hoodies.model.entity.Board;
import com.ssafy.hoodies.util.util;
import lombok.Data;

@Data
public class BoardDto {

    private String title;
    private String userName;
    private String content;
    private int hit;
    private int like;
    private String createdAt;
    private String modifiedAt;
//    private Comment comment; // List<Comment> ?
    // private ??? image;

    public Board toEntity(String usage) {
        Board board = new Board();

        board.setTitle(title);
        board.setUserName(userName);
        board.setContent(content);
        if("save".equals(usage)){
            String now = util.getTimeStamp();
            board.setHit(0);
            board.setLike(0);
            board.setCreatedAt(now);
            board.setModifiedAt(now);
        }else if("update".equals(usage)){
            board.setHit(hit);
            board.setLike(like);
            board.setCreatedAt(createdAt);
            board.setModifiedAt( util.getTimeStamp() );
//            board.setComment(comment);
        }
        // board.setImage(image);

        return board;
    }

}
