package com.ssafy.hoodies.model.repository;

import com.ssafy.hoodies.model.entity.UserAuth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserAuthRepository extends JpaRepository<UserAuth, String> {
    UserAuth findByEmailAndAuthcode(String email, String authcode);
}
