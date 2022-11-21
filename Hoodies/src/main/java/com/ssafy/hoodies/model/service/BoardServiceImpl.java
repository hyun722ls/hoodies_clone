package com.ssafy.hoodies.model.service;

import com.ssafy.hoodies.model.BoardType;
import com.ssafy.hoodies.model.dto.BoardDto;
import com.ssafy.hoodies.model.entity.Board;
import com.ssafy.hoodies.model.repository.BoardRepository;
import com.ssafy.hoodies.util.util;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import static com.ssafy.hoodies.model.dto.BoardDto.fromEntity;

@Service
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService{

    @Value("${nickname.salt}")
    private String salt;
    private final BoardRepository boardRepository;
    private final MongoTemplate mongoTemplate;
    private final FileService fileService;

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

        // 기존 업로드 파일 삭제
        List<String> getFilePaths = dto.get().getFilePaths();
        if (getFilePaths != null) {
            for (String path : getFilePaths) {
                fileService.deleteFile(path);
            }
        }
        return 1;
    }

    @Transactional(readOnly = true)
    public List<BoardDto> findRecentBoard(){
        Sort sort = Sort.by("createdAt").descending();

        // 신고 횟수 19회 이하인 게시글만 조회
        Query boardQuery = new Query(Criteria.where("reporter.19").exists(false));
        boardQuery.with(sort);

        List<BoardDto> list = mongoTemplate.find(boardQuery, Board.class)
                                           .stream()
                                           .map(BoardDto::fromEntity)
                                           .collect(Collectors.toList());
        return list.subList(0, Math.min(list.size(), 10));
    }

    @Transactional(readOnly = true)
    public List<BoardDto> findPopularBoard(){
        Sort sort = Sort.by("like").descending().and(Sort.by("createdAt").descending());

        // 신고 횟수 19회 이하인 게시글만 조회
        Query boardQuery = new Query(Criteria.where("reporter.19").exists(false));
        boardQuery.with(sort);

        List<BoardDto> list = mongoTemplate.find(boardQuery, Board.class)
                                           .stream()
                                           .map(BoardDto::fromEntity)
                                           .collect(Collectors.toList());
        return list.subList(0, Math.min(list.size(), 10));
    }

    @Transactional
    public int reportBoard(String id, String nickname){
        Optional<BoardDto> dto = boardRepository.findById(id).map(BoardDto::fromEntity);
        if(!dto.isPresent()) return 0; // DB에서 게시글을 찾지 못함

        Set<String> reporter = dto.get().getReporter();

        // 잘못된 요청
        if(reporter == null || nickname == null) return 0;

        String encodedNickname = util.getEncryptStr(nickname, salt);

        boolean newRequest = reporter.add(encodedNickname);

        // 이미 신고했던 사용자
        if(!newRequest) return 0;

        Query boardQuery = new Query(Criteria.where("_id").is(id));
        Update boardUpdate = new Update();

        boardUpdate.set("reporter", reporter);
        boardUpdate.inc("hit", -1);

        return Long.valueOf(mongoTemplate.updateFirst(boardQuery, boardUpdate, Board.class)
                                         .getModifiedCount())
                                         .intValue();
    }

    @Transactional
    public int likeBoard(String id, String nickname){
        Optional<BoardDto> dto = boardRepository.findById(id).map(BoardDto::fromEntity);
        if(!dto.isPresent()) return 0; // DB에서 해당하는 게시글을 찾지 못함

        Map<String, Boolean> contributor = dto.get().getContributor();

        // 잘못된 요청
        if(contributor == null || nickname == null) return 0;

        String encodedNickname = util.getEncryptStr(nickname, salt);

        // 목록에 있으면 -1, 목록에 없거나 취소한 인원이면 +1
        boolean isContribute = contributor.getOrDefault(encodedNickname, false);
        int diff = isContribute ? -1 : +1;
        contributor.put(encodedNickname, !isContribute);

        Query boardQuery = new Query(Criteria.where("_id").is(id));
        Update boardUpdate = new Update();

        boardUpdate.set("contributor", contributor);
        boardUpdate.inc("like", diff);
        boardUpdate.inc("hit", -1);

        return Long.valueOf(mongoTemplate.updateFirst(boardQuery, boardUpdate, Board.class)
                                         .getModifiedCount())
                                         .intValue();
    }

    @Transactional
    public Page<BoardDto> searchBoard(int type, int option, String keyword, Pageable pageable){
        Set<String> keywords = new HashSet<>(Arrays.asList(keyword.trim().split("\\s+"))); // 키워드 공백으로 분리
        Predicate<BoardDto> expression = o -> false;
        switch(option){
            case 1: // 제목만 조회
                expression = boardDto -> keywords.stream().allMatch(boardDto.getTitle()::contains);
                break;
            case 2: // 작성자만 조회
                expression = boardDto -> boardDto.getWriter().equals(keyword);
                break;
            case 3: // 내용만 조회
                expression = boardDto -> keywords.stream().allMatch(boardDto.getContent()::contains);
                break;
            default:
                break;
        }
        List<BoardDto> boardDtoList =  boardRepository.findAllByType(type)
                                                      .stream()
                                                      .map(BoardDto::fromEntity)
                                                      .filter(expression)
                                                      .sorted(Comparator.comparing(BoardDto::getCreatedAt).reversed())
                                                      .collect(Collectors.toList());

        int page = pageable.getPageNumber()-1;
        int size = pageable.getPageSize();
        long start =  PageRequest.of(page, size).getOffset();
        long end = (start + size) > boardDtoList.size() ? boardDtoList.size() : (start + size);

        return new PageImpl<>(boardDtoList.subList((int)start, (int)end), PageRequest.of(page, size), boardDtoList.size());
    }
}
