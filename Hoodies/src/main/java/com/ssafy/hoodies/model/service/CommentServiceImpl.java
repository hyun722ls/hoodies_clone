package com.ssafy.hoodies.model.service;

import com.ssafy.hoodies.model.BoardType;
import com.ssafy.hoodies.model.dto.BoardDto;
import com.ssafy.hoodies.model.dto.CommentDto;
import com.ssafy.hoodies.model.entity.Board;
import com.ssafy.hoodies.model.repository.BoardRepository;
import com.ssafy.hoodies.util.util;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService{
    @Value("${nickname.salt}")
    private String salt;
    private final MongoTemplate mongoTemplate;
    private final BoardRepository boardRepository;

    @Transactional
    public int addComment(CommentDto commentDto, String id) {
        Optional<BoardDto> dto = boardRepository.findById(id).map(BoardDto::fromEntity);
        if(!dto.isPresent()) return 0; // DB에서 게시글을 찾지 못함

        String nickname = commentDto.getWriter();

        // 잘못된 요청
        if(nickname == null) return 0;

        switch (BoardType.convert(commentDto.getType())) {
            case FREE: // 자유게시판
                break;
            case ANON: // 익명게시판
                String encodedNickname = util.getEncryptStr(nickname, salt);
                commentDto.setWriter(encodedNickname);
                break;
            default:
                break;
        }

        Query commentQuery = new Query(Criteria.where("_id").is(id));
        Update commentUpdate = new Update();

        commentUpdate.inc("hit", -1);
        commentUpdate.push("comments", commentDto.toEntity());

        return Long.valueOf(mongoTemplate.updateFirst(commentQuery, commentUpdate, Board.class)
                                         .getModifiedCount())
                                         .intValue();
    }

    @Transactional
    public int modifyComment(CommentDto commentDto, String id) {
        Optional<BoardDto> bDto = boardRepository.findById(id).map(BoardDto::fromEntity);
        if(!bDto.isPresent()) return 0; // DB에서 게시글을 찾지 못함
        
        String nickname = commentDto.getWriter();
        
        // 잘못된 요청
        if(nickname == null) return 0;
        
        String encodedNickname = util.getEncryptStr(nickname, salt);

        // 해당하는 댓글 탐색
        Optional<CommentDto> cDto = bDto.get().getComments()
                                              .stream()
                                              .map(CommentDto::fromEntity)
                                              .filter(comment -> comment.get_id().equals(commentDto.get_id())                )
                                              .findAny();

        if(!cDto.isPresent()) return 0; // DB에서 댓글을 찾지 못함

        String writer = cDto.get().getWriter();

        if(writer == null) return 0; // 잘못된 요청
        
        // 권한이 없는 수정 요청
        if(! (writer.equals(nickname) || writer.equals(encodedNickname)) ) return 0;

        Query commentQuery = new Query();
        commentQuery.addCriteria(Criteria.where("_id").is(id));
        commentQuery.addCriteria(Criteria.where("comments").elemMatch(Criteria.where("_id").is(commentDto.get_id())));

        Update commentUpdate = new Update();
        commentUpdate.inc("hit", -1);
        commentUpdate.set("comments.$.content", commentDto.getContent());
        commentUpdate.set("comments.$.modifiedAt", util.getTimeStamp());
        commentUpdate.set("comments.$.category", commentDto.getCategory());

        return Long.valueOf(mongoTemplate.updateFirst(commentQuery, commentUpdate, Board.class)
                                         .getModifiedCount())
                                         .intValue();
    }

    @Transactional
    public int removeComment(String bid, String cid, String nickname, boolean isAdmin) {
        Optional<BoardDto> bDto = boardRepository.findById(bid).map(BoardDto::fromEntity);
        if(!bDto.isPresent()) return 0; // DB에서 게시글을 찾지 못함

        // 잘못된 요청
        if(nickname == null) return 0;

        String encodedNickname = util.getEncryptStr(nickname, salt);

        // 해당하는 댓글 탐색
        Optional<CommentDto> cDto = bDto.get().getComments()
                                              .stream()
                                              .map(CommentDto::fromEntity)
                                              .filter(comment -> comment.get_id().equals(cid))
                                              .findAny();

        if(!cDto.isPresent()) return 0; // DB에서 댓글을 찾지 못함

        String writer = cDto.get().getWriter();

        if(writer == null) return 0; // 잘못된 요청

        // 권한이 없는 삭제 요청
        if(! (isAdmin || writer.equals(nickname) || writer.equals(encodedNickname)) ) return 0;

        Query commentQuery = new Query();
        commentQuery.addCriteria(Criteria.where("_id").is(bid));
        commentQuery.addCriteria(Criteria.where("comments").elemMatch(Criteria.where("_id").is(cid)));

        Update commentUpdate = new Update();
        commentUpdate.inc("hit", -1);
        commentUpdate.pull("comments", Query.query(Criteria.where("_id").is(cid)));

        return Long.valueOf(mongoTemplate.updateFirst(commentQuery, commentUpdate, Board.class)
                                         .getModifiedCount())
                                         .intValue();
    }

    @Transactional
    public int reportComment(String bid, String cid, String nickname) {
        Optional<BoardDto> bDto = boardRepository.findById(bid).map(BoardDto::fromEntity);
        if(!bDto.isPresent()) return 0; // DB에서 게시글을 찾지 못함

        // 잘못된 요청
        if(nickname == null) return 0;

        String encodedNickname = util.getEncryptStr(nickname, salt);

        // 해당하는 댓글 탐색
        Optional<CommentDto> cDto = bDto.get().getComments()
                                              .stream()
                                              .map(CommentDto::fromEntity)
                                              .filter(comment -> comment.get_id().equals(cid))
                                              .findAny();

        if(!cDto.isPresent()) return 0; // DB에서 댓글을 찾지 못함

        Set<String> reporter = cDto.get().getReporter();

        boolean newRequest = reporter.add(encodedNickname);

        // 이미 신고했던 사용자
        if(!newRequest) return 0;

        Query commentQuery = new Query();
        commentQuery.addCriteria(Criteria.where("_id").is(bid));
        commentQuery.addCriteria(Criteria.where("comments").elemMatch(Criteria.where("_id").is(cid)));

        Update commentUpdate = new Update();
        commentUpdate.set("comments.$.reporter", reporter);
        commentUpdate.inc("hit", -1);

        return Long.valueOf(mongoTemplate.updateFirst(commentQuery, commentUpdate, Board.class)
                                         .getModifiedCount())
                                         .intValue();
    }
}
