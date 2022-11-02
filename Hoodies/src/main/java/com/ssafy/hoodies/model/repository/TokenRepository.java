package com.ssafy.hoodies.model.repository;

import com.ssafy.hoodies.model.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TokenRepository extends JpaRepository<Token, String> {
    Token findByRefreshToken(String refreshToken);

}
