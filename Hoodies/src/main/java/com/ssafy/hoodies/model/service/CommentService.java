package com.ssafy.hoodies.model.service;

import com.ssafy.hoodies.model.dto.CommentDto;

public interface CommentService {
    public int addComment(CommentDto dto, String id);
    public int modifyComment(CommentDto dto, String id);
    public int removeComment(String bid, String cid, String nickname, boolean isAdmin);
    public int reportComment(String bid, String cid, String nickname);
}
