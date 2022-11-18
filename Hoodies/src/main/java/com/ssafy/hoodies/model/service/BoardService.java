package com.ssafy.hoodies.model.service;

import com.ssafy.hoodies.model.dto.BoardDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BoardService {
    public BoardDto addBoard(BoardDto dto);
    public Page<BoardDto> findBoards(int type, Pageable pageable);
    public BoardDto findBoard(String id);
    public int modifyBoard(BoardDto dto);
    public int removeBoard(String id, String nickname, boolean isAdmin);
    public List<BoardDto> findRecentBoard();
    public List<BoardDto> findPopularBoard();
    public int reportBoard(String id, String nickname);
    public int likeBoard(String id, String nickname);

    public Page<BoardDto> searchBoard(int type, int option, String keyword, Pageable pageable);
}
