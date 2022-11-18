package com.ssafy.hoodies.model.service;

import com.ssafy.hoodies.model.entity.Board;

import java.util.List;

public interface UserService {

    public int checkNickname(String nickname);

    public String sendSignUpMM(String email, int flag);

    public boolean authMM(String email, String authcode);

    public String sendResetPassword(String email, int flag);

    public String authResetPassword(String email, String authcode);

    public String updateNickname(String email, String nickname);

    public String updatePassword(String email, String password);

    public List<Board> findUserBoard(String writer);

    public String findNickname(String email);
}
