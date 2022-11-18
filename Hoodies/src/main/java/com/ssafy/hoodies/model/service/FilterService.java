package com.ssafy.hoodies.model.service;

public interface FilterService {
    public String filterBoth(String title, String content);
    public String filterContent(String content);
    public String filterImage();
}
