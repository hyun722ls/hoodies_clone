package com.ssafy.hoodies.util;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;

public class util {
    private util(){}
    public static String getTimeStamp(){
        Timestamp timestamp = new Timestamp(System.currentTimeMillis());
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd kk:mm:ss");
        return sdf.format(timestamp);
    }

    public static ResponseEntity<String> checkExpression(String title, String content, String type){
        String url = "https://k7a402.p.ssafy.io/ai/" + type;
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        if(type == "article"){
            params.add("title", title);
            params.add("content", content);
        }else if(type == "comment"){
            params.add("comment", content);
        }
        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, new HttpHeaders());
        ResponseEntity<String> res = new RestTemplate().exchange(
                url, //{요청할 서버 주소}
                HttpMethod.POST, //{요청할 방식}
                entity, // {요청할 때 보낼 데이터}
                String.class //{요청시 반환되는 데이터 타입}
        );
        System.out.println(res);
        return res;
    }
}
