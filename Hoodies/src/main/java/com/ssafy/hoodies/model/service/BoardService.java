package com.ssafy.hoodies.model.service;

import com.ssafy.hoodies.model.dto.BoardDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BoardService {
    public BoardDto addBoard(BoardDto dto);
    public Page<BoardDto> findBoards(int type, Pageable pageable);
    public BoardDto findBoard(String id);
    public int modifyBoard(BoardDto dto);
    public int removeBoard(String id, String nickname, boolean isAdmin);
}
