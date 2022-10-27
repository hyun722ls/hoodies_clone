package com.ssafy.hoodies.model.service;

public interface UserService {

    public String getRandomGenerateString(int targetStringLength);

    public String sendMM(String email, int flag) throws Exception;

    public String getEncryptPassword(String password, String salt);
}
