package com.ssafy.hoodies.model.entity;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.sql.Timestamp;

@NoArgsConstructor
@Data
@Entity
@Table(name = "userauth")
public class UserAuth {
    @Id
    private String email;
    private String authcode;
    private Timestamp time;
    private boolean authflag;

    @Builder
    public UserAuth(String email, String authcode, Timestamp time, boolean authflag) {
        this.email = email;
        this.authcode = authcode;
        this.time = time;
        this.authflag = authflag;
    }
}
