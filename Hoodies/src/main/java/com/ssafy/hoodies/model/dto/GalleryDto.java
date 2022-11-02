package com.ssafy.hoodies.model.dto;

import com.ssafy.hoodies.model.entity.Gallery;
import com.victolee.s3exam.domain.entity.GalleryEntity;
import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class GalleryDto {
    private Long id;
    private String title;
    private String filePath;

    public Gallery toEntity(){
        Gallery build = Gallery.builder()
                .id(id)
                .title(title)
                .filePath(filePath)
                .build();
        return build;
    }

    @Builder
    public GalleryDto(Long id, String title, String filePath) {
        this.id = id;
        this.title = title;
        this.filePath = filePath;
    }
}
