package com.ssafy.hoodies.model.service;

import com.ssafy.hoodies.model.BoardType;
import com.ssafy.hoodies.model.dto.BoardDto;
import com.ssafy.hoodies.model.entity.Board;
import com.ssafy.hoodies.model.repository.BoardRepository;
import com.ssafy.hoodies.util.util;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static com.ssafy.hoodies.model.dto.BoardDto.fromEntity;

@Service
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService{

    @Value("${nickname.salt}")
    private String salt;
    private final BoardRepository boardRepository;
    private final MongoTemplate mongoTemplate;

    @Transactional
    public BoardDto addBoard(BoardDto dto){
        switch(BoardType.convert(dto.getType())){
            case FREE: // 자유게시판
                break;
            case ANON: // 익명게시판
                String encryptWriter = util.getEncryptStr(dto.getWriter(), salt);
                dto.setWriter(encryptWriter);
                break;
            default:
                break;
        }
        return fromEntity(boardRepository.save(dto.toEntity()));
    }

    @Transactional(readOnly = true)
    public Page<BoardDto> findBoards(int type, Pageable pageable){
        Sort sort = Sort.by("createdAt").descending();
        PageRequest pageRequest = PageRequest.of(pageable.getPageNumber()-1, pageable.getPageSize(), sort);
        return boardRepository.findAllByType(type, pageRequest).map(BoardDto::fromEntity);
    }

    @Transactional
    public BoardDto findBoard(String id){
        FindAndModifyOptions findAndModifyOptions = FindAndModifyOptions.options().returnNew(true);
        Query boardQuery = new Query(Criteria.where("_id").is(id));
        Update boardUpdate = new Update().inc("hit", 1);
        return fromEntity(mongoTemplate.findAndModify(boardQuery, boardUpdate, findAndModifyOptions, Board.class));
    }

    @Transactional
    public int modifyBoard(BoardDto boardDto){
        String id = boardDto.get_id();
        String nickname = boardDto.getWriter(); // Token 상의 닉네임

        Optional<BoardDto> dto = boardRepository.findById(id).map(BoardDto::fromEntity);
        if(!dto.isPresent()) return 0; // DB에서 게시글 작성자를 찾지 못함

        String writer = dto.get().getWriter(); // DB 상의 게시글 작성자

        // 잘못된 요청
        if(writer == null || nickname == null) return 0;

        String encodedNickname = util.getEncryptStr(nickname, salt);

        // 권한이 없는 수정 요청
        if(! (writer.equals(nickname) || writer.equals(encodedNickname)) ) return 0;

        Query boardQuery = new Query(Criteria.where("_id").is(id));
        Update boardUpdate = new Update();

        boardUpdate.set("title", boardDto.getTitle());
        boardUpdate.set("content", boardDto.getContent());
        boardUpdate.set("category", boardDto.getCategory());
        boardUpdate.set("modifiedAt", util.getTimeStamp());
        return Long.valueOf(mongoTemplate.updateFirst(boardQuery, boardUpdate, Board.class)
                                         .getModifiedCount())
                                         .intValue();
    }

    @Transactional
    public int removeBoard(String id, String nickname, boolean isAdmin){
        Optional<BoardDto> dto = boardRepository.findById(id).map(BoardDto::fromEntity);
        if(!dto.isPresent()) return 0; // DB에서 게시글 작성자를 찾지 못함

        String writer = dto.get().getWriter(); // DB 상의 게시글 작성자

        // 잘못된 요청
        if(writer == null || nickname == null) return 0;

        String encodedNickname = util.getEncryptStr(nickname, salt);

        // 권한이 없는 수정 요청
        if(! (isAdmin || writer.equals(nickname) || writer.equals(encodedNickname)) ) return 0;

        boardRepository.deleteById(id);

        return 1;
    }
}
