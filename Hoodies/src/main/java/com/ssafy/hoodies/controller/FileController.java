package com.ssafy.hoodies.controller;

import com.mongodb.client.result.UpdateResult;
import com.ssafy.hoodies.model.entity.Board;
import com.ssafy.hoodies.model.repository.BoardRepository;
import com.ssafy.hoodies.model.service.FileService;
import com.ssafy.hoodies.model.service.SecurityService;
import com.ssafy.hoodies.model.service.UserService;
import com.ssafy.hoodies.util.util;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Api(tags = {"파일 API"})
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@RestController
public class FileController {
    private final MongoTemplate mongoTemplate;
    private final BoardRepository boardRepository;

    private final SecurityService securityService;
    private final UserService userService;
    private final FileService fileService;

    @Value("${nickname.salt}")
    private String salt;

    @PostMapping("/file/{id}")
    @ApiOperation(value = "파일 업로드")
    public JSONObject uploadFile(@PathVariable String id, List<MultipartFile> files) {
        JSONObject json = new JSONObject();
        int statusCode = 400;

        String email = securityService.findEmail();
        String nickname = userService.findNickname(email);
        String encodedNickname = util.getEncryptStr(nickname, salt);

        try {
            Board board = boardRepository.findById(id).get();
            String writer = board.getWriter();

            // 권한이 없는 요청
            if (!(writer.equals(nickname) || writer.equals(encodedNickname))) {
                json.put("statusCode", statusCode);
                return json;
            }

            // 기존 업로드 파일 삭제
            List<String> getFilePaths = board.getFilePaths();
            if (getFilePaths != null) {
                for (String path : getFilePaths) {
                    fileService.deleteFile(path);
                }
            }

            // 파일 업로드
            List<String> filePaths = new ArrayList<>();
            if (files != null) {
                for (int i = 0; i < Math.min(files.size(), 4); i++) {
                    MultipartFile file = files.get(i);
                    boolean randomFilenameFlag = true;
                    if (getFilePaths != null && getFilePaths.contains(file.getOriginalFilename()))
                        randomFilenameFlag = false;
                    String path = fileService.upload(file, randomFilenameFlag);
                    // upload에 실패한 경우
                    if (path.equals("fail"))
                        continue;
                    filePaths.add(path);
                }
            }

            Query boardQuery = new Query(Criteria.where("_id").is(id));
            Update boardUpdate = new Update();
            boardUpdate.set("filePaths", filePaths);
            UpdateResult ur = mongoTemplate.updateFirst(boardQuery, boardUpdate, "board");

            statusCode = 200;
            json.put("filePaths", filePaths);
            json.put("statusCode", statusCode);
        } catch (Exception e) {
            statusCode = 400;
            json.put("statusCode", statusCode);
        }
        return json;
    }
}
