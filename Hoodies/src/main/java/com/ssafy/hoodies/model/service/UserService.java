package com.ssafy.hoodies.model.service;

public interface UserService {

    public int checkNickname(String nickname);

    public String sendMM(String email, int flag);

    public boolean authMM(String email, String authcode);

    public String findNickname(String email);
}
