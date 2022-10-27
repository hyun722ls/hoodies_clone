package com.ssafy.hoodies.model.service;

import java.util.Map;

public interface JwtService {

    <T> String create(String key, T data, String subject);

    boolean isUsable(String jwt);

    Map<String, Object> get();

    String getUserEmail();

}
