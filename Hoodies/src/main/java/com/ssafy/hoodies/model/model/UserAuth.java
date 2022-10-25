package com.ssafy.hoodies.model.model;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@NoArgsConstructor
@Data
@Entity
@Table(name = "userauth")
public class UserAuth {
    @Id
    private String email;
    private String authcode;

    @Builder
    public UserAuth(String email, String authcode) {
        this.email = email;
        this.authcode = authcode;
    }
}
