package com.ssafy.hoodies.model.repository;

import com.ssafy.hoodies.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    User findByNickname(String nickname);

    User findByEmailAndPassword(String email, String password);

    List<User> findByEmailStartsWith(String email);

}
