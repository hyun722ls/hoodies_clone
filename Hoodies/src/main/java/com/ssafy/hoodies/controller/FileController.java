package com.ssafy.hoodies.controller;

import com.ssafy.hoodies.model.service.FileService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.json.simple.JSONObject;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Api(tags = {"파일 API"})
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@RestController
public class FileController {

    private final FileService fileService;

    @PostMapping("/file/{id}")
    @ApiOperation(value = "파일 업로드")
    public JSONObject uploadFile(@PathVariable String id, List<MultipartFile> files) {
        JSONObject json = new JSONObject();
        int statusCode = 400;

        List<String> filePaths = fileService.uploadFile(id, files);
        if (filePaths == null) {
            json.put("statusCode", statusCode);
            return json;
        }

        statusCode = 200;
        json.put("filePaths", filePaths);
        json.put("statusCode", statusCode);
        return json;
    }
}
