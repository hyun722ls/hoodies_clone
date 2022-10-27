package com.ssafy.hoodies.model.repository;

import com.ssafy.hoodies.model.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    User findByNickname(String nickname);

    User findByEmailAndPassword(String email, String password);
}
