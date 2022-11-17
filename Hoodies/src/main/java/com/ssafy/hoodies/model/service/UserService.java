package com.ssafy.hoodies.model.service;

public interface UserService {

    public int checkNickname(String nickname);

    public String sendSignUpMM(String email, int flag);

    public boolean authMM(String email, String authcode);

    public String sendResetPassword(String email, int flag);

    public String authResetPassword(String email, String authcode);

    public String findNickname(String email);
}
