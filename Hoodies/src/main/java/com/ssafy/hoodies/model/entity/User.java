package com.ssafy.hoodies.model.entity;

import com.ssafy.hoodies.model.Role;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

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

    @Enumerated(EnumType.STRING)
    private Role role;

    @Builder
    public User(String email, String password, String nickname, String salt, Role role) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.salt = salt;
        this.role = role;
    }
}
