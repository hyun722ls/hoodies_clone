package com.ssafy.hoodies.model.model;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@NoArgsConstructor
@Data
@Entity
@Table(name = "user")
public class User {
    @Id
    private String email;
    private String password;
    private String nickname;

    @Column(length = 8)
    private String salt;

    @Builder
    public User(String email, String password, String nickname, String salt) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.salt = salt;
    }
}
