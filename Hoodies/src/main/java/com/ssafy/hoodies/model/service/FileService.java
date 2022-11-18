package com.ssafy.hoodies.model.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FileService {

    public List<String> uploadFile(String id, List<MultipartFile> files);

    public void deleteFile(String fileName);
}
