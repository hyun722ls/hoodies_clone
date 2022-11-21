package com.ssafy.hoodies.model.service;

import com.ssafy.hoodies.util.util;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class FilterServiceImpl implements FilterService {
    public String filterBoth(String title, String content){
        ResponseEntity<String> response = util.checkExpression(title, content, "article");
        if(response.getBody() == null) return "";
        return response.getBody().trim();
    }
    public String filterContent(String content){
        ResponseEntity<String> response = util.checkExpression("", content, "comment");
        if(response.getBody() == null) return "";
        return response.getBody().trim();
    }
    public String filterImage(){
        return "";
    }
}
