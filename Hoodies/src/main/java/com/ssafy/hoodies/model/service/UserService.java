package com.ssafy.hoodies.model.service;

public interface UserService {
    public String sendMM(String email, int flag);
    public String findNickname(String email);
}
