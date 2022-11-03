package com.ssafy.hoodies.model.service;

import com.ssafy.hoodies.model.dto.GalleryDto;
import com.ssafy.hoodies.model.repository.GalleryRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class GalleryService {
    private GalleryRepository galleryRepository;

    public void savePost(GalleryDto galleryDto) {
        galleryRepository.save(galleryDto.toEntity());
    }
}