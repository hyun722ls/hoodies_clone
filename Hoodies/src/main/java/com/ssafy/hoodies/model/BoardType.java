package com.ssafy.hoodies.model;

import org.springframework.security.core.parameters.P;

public enum BoardType {
    FREE(1),  // 1: 자유게시판
    ANON(2);  // 2: 익명게시판

    private int type;

    BoardType(int type){
        this.type = type;
    }

    public static BoardType convert(int type){
        for(BoardType boardType : BoardType.values()){
            if(boardType.type == type) return boardType;
        }
        throw new RuntimeException();
    }
}
