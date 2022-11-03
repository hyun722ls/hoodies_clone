package com.ssafy.hoodies.model.repository;

import com.ssafy.hoodies.model.entity.Gallery;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GalleryRepository extends JpaRepository<Gallery, Long> {
}