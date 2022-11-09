package com.ssafy.hoodies.controller;

import com.mongodb.client.result.UpdateResult;
import com.ssafy.hoodies.model.BoardType;
import com.ssafy.hoodies.model.dto.*;
import com.ssafy.hoodies.model.entity.Board;
import com.ssafy.hoodies.model.entity.Comment;
import com.ssafy.hoodies.model.entity.Feedback;
import com.ssafy.hoodies.model.entity.User;
import com.ssafy.hoodies.model.repository.BoardRepository;
import com.ssafy.hoodies.model.repository.FeedbackRepository;
import com.ssafy.hoodies.model.repository.UserRepository;
import com.ssafy.hoodies.model.service.*;
import com.ssafy.hoodies.util.util;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import org.json.simple.JSONObject;
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
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RequiredArgsConstructor
@RestController
@Api(tags = {"게시판 API"})
@CrossOrigin(origins = "*")
public class BoardController {

    private final BoardRepository boardRepository;
    private final MongoTemplate mongoTemplate;
    private final FileService fileService;
    private final UserRepository userRepository;
    private final FeedbackRepository feedbackRepository;

    //-----------------------------------------
    @Value("${nickname.salt}")
    private String salt;

    private final BoardService boardService;
    private final FilterService filterService;
    private final SecurityService securityService;
    private final UserService userService;


    /****************
     *  게시물 CRUD  *
     ****************/

    // Create
    @PostMapping("/board")
    @ApiOperation(value = "게시물 작성")
    public BoardDto boardAdd(@RequestBody BoardRequestDto requestDto){
        String email = securityService.findEmail();
        String writer = userService.findNickname(email);
        String category = filterService.filterBoth(requestDto.getTitle(), requestDto.getContent());
        BoardDto dto = requestDto.toDto();
        dto.setWriter(writer);
        dto.setCategory(category);
        return boardService.addBoard(dto);
    }

    // Retrieve
    // 게시물 조회 --> https://~/api/board?page=0&size=5&sort=id.desc
    @GetMapping("/board/{type}")
    @ApiOperation(value = "유형별 전체 게시물 조회")
    public Page<BoardDto> boardList(Pageable pageable,
                                    @ApiParam(
                                            name = "type",
                                            type = "int",
                                            value = "게시물의 유형",
                                            required = true)
                                    @PathVariable int type){
        return boardService.findBoards(type, pageable);
    }

    // 특정 게시물 조회
    @GetMapping("/board/detail/{id}")
    @ApiOperation(value = "id로 특정 게시물 조회")
    public BoardDto boardDetail(
            @ApiParam(
                    name = "id",
                    type = "String",
                    value = "게시물의 DB상 id",
                    required = true)
            @PathVariable String id){
        return boardService.findBoard(id);
    }

    // Update
    @PutMapping("/board/detail/{id}")
    @ApiOperation(value = "id로 특정 게시물 수정")
    public JSONObject boardModify(@RequestBody BoardRequestDto requestDto,
                                  @ApiParam(
                                          name = "id",
                                          type = "String",
                                          value = "게시물의 DB상 id",
                                          required = true)
                                  @PathVariable String id){
        JSONObject json = new JSONObject();

        // Token 상의 닉네임 조회
        String email = securityService.findEmail();
        String nickname = userService.findNickname(email);

        String category = filterService.filterBoth(requestDto.getTitle(), requestDto.getContent());
        BoardDto dto = requestDto.toDto();
        dto.setCategory(category);
        dto.set_id(id);
        dto.setWriter(nickname);

        int statusCode = boardService.modifyBoard(dto) > 0 ? 200 : 400;

        json.put("statusCode", statusCode);
        return json;
    }
    
    /////////////////////////////////////////// 내일부터 작업할 영역

    @PatchMapping("/board/detail/{id}/like")
    @ApiOperation(value = "id로 특정 게시물 좋아요 등록/해제")
    public JSONObject likeBoard(@ApiParam(
            name = "id",
            type = "String",
            value = "게시물의 DB상 id",
            required = true)
                                @PathVariable String id) {
        // 목록에 있으면 -1, 목록에 없거나 취소한 인원이면 +1
        // 작성자 인코딩 필요
        JSONObject json = new JSONObject();
        int statusCode = 400;
        try {
            Map<String, Boolean> contributor = boardRepository.findById(id).get().getContributor();

            SecurityContext context = SecurityContextHolder.getContext();
            Authentication authentication = context.getAuthentication();
            String email = ((org.springframework.security.core.userdetails.User) authentication.getPrincipal()).getUsername();

            User user = userRepository.findById(email).get();

            String euser = util.getEncryptStr(user.getNickname(), salt);
            boolean value = contributor.getOrDefault(euser, false);
            int diff = value ? -1 : +1;
            contributor.put(euser, !value);

            Query boardQuery = new Query(Criteria.where("_id").is(id));
            Update boardUpdate = new Update();
            boardUpdate.set("contributor", contributor);
            boardUpdate.inc("like", diff);
            boardUpdate.inc("hit", -1);
            UpdateResult ur = mongoTemplate.updateFirst(boardQuery, boardUpdate, "board");

            statusCode = ur.getModifiedCount() > 0 ? 200 : 400;
            json.put("statusCode", statusCode);
        } catch (Exception e) {
            json.put("statusCode", statusCode);
        }
        return json;
    }

    // Delete
    @DeleteMapping("/board/detail/{id}")
    @ApiOperation(value = "id로 특정 게시물 삭제")
    public JSONObject deleteBoard(
            @ApiParam(
                    name = "id",
                    type = "String",
                    value = "게시물의 DB상 id",
                    required = true)
            @PathVariable String id) {
        JSONObject json = new JSONObject();
        int statusCode = 400;
        try {
            SecurityContext context = SecurityContextHolder.getContext();
            Authentication authentication = context.getAuthentication();
            String email = ((org.springframework.security.core.userdetails.User) authentication.getPrincipal()).getUsername();
            boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));

            User user = userRepository.findById(email).get();
            String nickname = user.getNickname();
            String hashNickname = util.getEncryptStr(nickname, salt);
            String writer = boardRepository.findById(id).get().getWriter();

            // 관리자 또는 글 작성자가 아닌 경우
            if (!(isAdmin || nickname.equals(writer) || hashNickname.equals(writer))) {
                json.put("statusCode", statusCode);
                return json;
            }

            boolean isExist = boardRepository.existsById(id);
            boardRepository.deleteById(id);
            statusCode = isExist ? 200 : 400;
            json.put("statusCode", statusCode);
        } catch (Exception e) {
            json.put("statusCode", statusCode);
        }
        return json;
    }

    // 게시물 10개 조회
    // 최근 게시물 조회
    @GetMapping("/preview/free")
    @ApiOperation(value = "최근 게시물 10개 조회")
    public List<Board> findRecentBoard() {
        Sort sort = Sort.by("createdAt").descending();
        // 신고 횟수 19회 이하인 게시글만 조회
        Query boardQuery = new Query(Criteria.where("reporter.19").exists(false));
        boardQuery.with(sort);

        List<Board> list = mongoTemplate.find(boardQuery, Board.class);
        return list.subList(0, Math.min(list.size(), 10));
    }

    // 인기 게시물 조회
    @GetMapping("/preview/popular")
    @ApiOperation(value = "인기 게시물 10개 조회")
    public List<Board> findPopularBoard() {
        Sort sort = Sort.by("like").descending().and(Sort.by("createdAt").descending());
        // 신고 횟수 19회 이하인 게시글만 조회
        Query boardQuery = new Query(Criteria.where("reporter.19").exists(false));
        boardQuery.with(sort);

        List<Board> list = mongoTemplate.find(boardQuery, Board.class);
        return list.subList(0, Math.min(list.size(), 10));
    }

    @PostMapping("/file/{id}")
    @ApiOperation(value = "파일 업로드")
    public JSONObject uploadFile(@PathVariable String id, MultipartFile file) {
        String filePath = fileService.upload(file);
        JSONObject json = new JSONObject();
        int statusCode = 400;

        // upload에 실패한 경우
        if (filePath.equals("fail")) {
            json.put("statusCode", statusCode);
            return json;
        }

        Query boardQuery = new Query(Criteria.where("_id").is(id));
        Update boardUpdate = new Update();
        boardUpdate.set("filePath", filePath);
        UpdateResult ur = mongoTemplate.updateFirst(boardQuery, boardUpdate, "board");

        // 파일 경로 추가에 실패한 경우
        if (ur.getModifiedCount() == 0) {
            fileService.deleteFile(filePath);
            json.put("statusCode", statusCode);
            return json;
        }

        json.put("filePath", filePath);
        statusCode = 200;
        json.put("statusCode", statusCode);
        return json;
    }

    /************
     * 댓글 CRUD *
     ************/
    // 댓글 등록
    @PostMapping("/board/{id}/comment")
    @ApiOperation(value = "댓글 등록")
    public JSONObject writeComment(@RequestBody CommentDto dto, @PathVariable String id) {
        JSONObject json = new JSONObject();
        int statusCode = 400;
        try {
            SecurityContext context = SecurityContextHolder.getContext();
            Authentication authentication = context.getAuthentication();
            String email = ((org.springframework.security.core.userdetails.User) authentication.getPrincipal()).getUsername();

            User user = userRepository.findById(email).get();
            String nickname = user.getNickname();

            ResponseEntity<String> res = util.checkExpression("", dto.getContent(), "comment");
            Comment comment = dto.toEntity();
            comment.setCategory(res.getBody().trim());

            switch (BoardType.convert(dto.getType())) {
                case FREE: // 자유게시판
                    comment.setWriter(nickname);
                    break;
                case ANON: // 익명게시판
                    String ename = util.getEncryptStr(nickname, salt);
                    comment.setWriter(ename);
                    break;
            }

            Query commentQuery = new Query(Criteria.where("_id").is(id));
            Update commentUpdate = new Update();
            commentUpdate.inc("hit", -1);
            commentUpdate.push("comments", comment);

            UpdateResult ur = mongoTemplate.updateFirst(commentQuery, commentUpdate, "board");

            statusCode = ur.getModifiedCount() > 0 ? 200 : 400;
            json.put("statusCode", statusCode);
        } catch (Exception e) {
        }
        return json;
    }

    // 댓글 수정
    @PutMapping("/board/{bid}/comment/{cid}")
    @ApiOperation(value = "댓글 수정")
    public JSONObject updateComment(@RequestBody CommentDto dto, @PathVariable String bid, @PathVariable String cid) {
        JSONObject json = new JSONObject();
        int statusCode = 400;
        try {
            SecurityContext context = SecurityContextHolder.getContext();
            Authentication authentication = context.getAuthentication();
            String email = ((org.springframework.security.core.userdetails.User) authentication.getPrincipal()).getUsername();

            User user = userRepository.findById(email).get();
            String nickname = user.getNickname();
            String hashNickname = util.getEncryptStr(nickname, salt);

            for (Comment comment : boardRepository.findById(bid).get().getComments()) {
                String getCid = comment.get_id();
                String writer = comment.getWriter();

                // 수정하려는 댓글이 아닌 경우
                if (!cid.equals(getCid))
                    continue;

                // 글 작성자가 아닌 경우
                if (!(nickname.equals(writer) || hashNickname.equals(writer))) {
                    json.put("statusCode", statusCode);
                    return json;
                }
            }

            ResponseEntity<String> res = util.checkExpression("", dto.getContent(), "comment");
            Query commentQuery = new Query();
            commentQuery.addCriteria(Criteria.where("_id").is(bid));
            commentQuery.addCriteria(Criteria.where("comments").elemMatch(Criteria.where("_id").is(cid)));
            Update commentUpdate = new Update();
            commentUpdate.inc("hit", -1);
            commentUpdate.set("comments.$.content", dto.getContent());
            commentUpdate.set("comments.$.modifiedAt", util.getTimeStamp());
            commentUpdate.set("comments.$.category", res.getBody().trim());

            UpdateResult ur = mongoTemplate.updateFirst(commentQuery, commentUpdate, "board");

            statusCode = ur.getModifiedCount() > 0 ? 200 : 400;
            json.put("statusCode", statusCode);
        } catch (Exception e) {
            json.put("statusCode", statusCode);
        }
        return json;

    }

    // 댓글 삭제
    @DeleteMapping("/board/{bid}/comment/{cid}")
    @ApiOperation(value = "댓글 삭제")
    public JSONObject deleteComment(@PathVariable String bid, @PathVariable String cid) {
        JSONObject json = new JSONObject();
        int statusCode = 400;
        try {
            SecurityContext context = SecurityContextHolder.getContext();
            Authentication authentication = context.getAuthentication();
            String email = ((org.springframework.security.core.userdetails.User) authentication.getPrincipal()).getUsername();
            boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));

            User user = userRepository.findById(email).get();
            String nickname = user.getNickname();
            String hashNickname = util.getEncryptStr(nickname, salt);

            for (Comment comment : boardRepository.findById(bid).get().getComments()) {
                String getCid = comment.get_id();
                String writer = comment.getWriter();

                // 삭제하려는 댓글이 아닌 경우
                if (!cid.equals(getCid))
                    continue;

                // 관리자 또는 글 작성자가 아닌 경우
                if (!(isAdmin || nickname.equals(writer) || hashNickname.equals(writer))) {
                    json.put("statusCode", statusCode);
                    return json;
                }
            }

            Query commentQuery = new Query();
            commentQuery.addCriteria(Criteria.where("_id").is(bid));
            commentQuery.addCriteria(Criteria.where("comments").elemMatch(Criteria.where("_id").is(cid)));
            Update commentUpdate = new Update();
            commentUpdate.inc("hit", -1);
            commentUpdate.pull("comments", Query.query(Criteria.where("_id").is(cid)));

            UpdateResult ur = mongoTemplate.updateFirst(commentQuery, commentUpdate, "board");

            statusCode = ur.getModifiedCount() > 0 ? 200 : 400;
            json.put("statusCode", statusCode);
        } catch (Exception e) {
            json.put("statusCode", statusCode);
        }
        return json;
    }

    // 게시물 신고
    @PutMapping("/board/detail/{id}/report")
    @ApiOperation(value = "게시물 신고")
    public JSONObject reportBoard(@PathVariable String id) {
        JSONObject json = new JSONObject();
        int statusCode = 400;
        try {
            Set<String> reporter = boardRepository.findById(id).get().getReporter();

            SecurityContext context = SecurityContextHolder.getContext();
            Authentication authentication = context.getAuthentication();
            String email = ((org.springframework.security.core.userdetails.User) authentication.getPrincipal()).getUsername();

            User user = userRepository.findById(email).get();

            String euser = util.getEncryptStr(user.getNickname(), salt);
            reporter.add(euser);

            Query boardQuery = new Query(Criteria.where("_id").is(id));
            Update boardUpdate = new Update();
            boardUpdate.set("reporter", reporter);
            boardUpdate.inc("hit", -1);
            UpdateResult ur = mongoTemplate.updateFirst(boardQuery, boardUpdate, "board");
            statusCode = ur.getModifiedCount() > 0 ? 200 : 400;
        } catch (Exception e) {
        }
        json.put("statusCode", statusCode);
        return json;
    }

    // 댓글 신고
    @PutMapping("/board/{bid}/comment/{cid}/report")
    @ApiOperation(value = "댓글 신고")
    public JSONObject reportBoard(@PathVariable String bid, @PathVariable String cid) {
        JSONObject json = new JSONObject();
        int statusCode = 400;
        try {
            Query commentQuery = new Query();
            commentQuery.addCriteria(Criteria.where("_id").is(bid));
            commentQuery.addCriteria(Criteria.where("comments").elemMatch(Criteria.where("_id").is(cid)));

            Set<String> reporter = new HashSet<>();
            for (Comment comment : boardRepository.findById(bid).get().getComments()) {
                if (comment.get_id().equals(cid)) {
                    reporter = comment.getReporter();
                    break;
                }
            }

            SecurityContext context = SecurityContextHolder.getContext();
            Authentication authentication = context.getAuthentication();
            String email = ((org.springframework.security.core.userdetails.User) authentication.getPrincipal()).getUsername();

            User user = userRepository.findById(email).get();

            String euser = util.getEncryptStr(user.getNickname(), salt);
            reporter.add(euser);

            Update commentUpdate = new Update();
            commentUpdate.set("comments.$.reporter", reporter);
            commentUpdate.inc("hit", -1);
            UpdateResult ur = mongoTemplate.updateFirst(commentQuery, commentUpdate, "board");
            statusCode = ur.getModifiedCount() > 0 ? 200 : 400;
        } catch (Exception e) {
        }
        json.put("statusCode", statusCode);
        return json;
    }

    @PostMapping("/board/feedback")
    @ApiOperation(value = "피드백 작성")
    public JSONObject writeFeedback(@RequestBody FeedbackDto feedbackDto) {
        JSONObject json = new JSONObject();
        int statusCode = 200;

        SecurityContext context = SecurityContextHolder.getContext();
        Authentication authentication = context.getAuthentication();
        String email = ((org.springframework.security.core.userdetails.User) authentication.getPrincipal()).getUsername();

        Feedback feedback = feedbackDto.toEntity();
        feedback.setWriter(email);
        feedbackRepository.save(feedback);

        json.put("statusCode", statusCode);
        return json;
    }

    @GetMapping("/admin/feedback")
    @ApiOperation(value = "피드백 조회")
    public List<Feedback> findAllFeedback() {
        Sort sort = Sort.by("createdAt").descending();
        return feedbackRepository.findAll(sort);
    }

    @PostMapping("/test/onefile")
    @ApiOperation(value = "파일 업로드 테스트")
    public JSONObject uploadFileTest(MultipartFile file) {
        String filePath = fileService.upload(file);
        JSONObject json = new JSONObject();
        int statusCode = 400;

        // upload에 실패한 경우
        if (filePath.equals("fail")) {
            json.put("statusCode", statusCode);
            return json;
        }

        json.put("filePath", filePath);
        statusCode = 200;
        json.put("statusCode", statusCode);
        return json;
    }

    @PostMapping("/test/miltifile")
    @ApiOperation(value = "다중 파일 업로드 테스트")
    public JSONObject uploadMultiFileTest(List<MultipartFile> files) {
        List<String> filePath = new ArrayList<>();
        List<Integer> filteredIdx = new ArrayList<>();
        for (int i = 0; i < files.size(); i++) {
            String path = fileService.upload(files.get(i));
            // upload에 실패한 경우
            if (path.equals("fail")) {
                filteredIdx.add(i + 1);
                continue;
            }
            filePath.add(path);
        }

        JSONObject json = new JSONObject();
        int statusCode = 200;

        json.put("filePath", filePath);
        json.put("filteredIdx", filteredIdx);
        json.put("statusCode", statusCode);
        return json;
    }

}
