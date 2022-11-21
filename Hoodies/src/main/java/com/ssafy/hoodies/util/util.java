package com.ssafy.hoodies.util;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.security.MessageDigest;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Random;
import java.util.TimeZone;

public class util {
    private util(){}
    public static String getTimeStamp(){
        Timestamp timestamp = new Timestamp(System.currentTimeMillis());
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd kk:mm:ss");
        sdf.setTimeZone(TimeZone.getTimeZone("Asia/Seoul"));
        return sdf.format(timestamp);
    }

    public static ResponseEntity<String> checkExpression(String title, String content, String type){
        String url = "https://k7a402.p.ssafy.io/ai/" + type;
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        if("article".equals(type)){
            params.add("title", title);
            params.add("content", content);
        }else if("comment".equals(type)){
            params.add("comment", content);
        }
        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, new HttpHeaders());
        return new RestTemplate().exchange(
                url, //{요청할 서버 주소}
                HttpMethod.POST, //{요청할 방식}
                entity, // {요청할 때 보낼 데이터}
                String.class //{요청시 반환되는 데이터 타입}
        );
    }

    public static String getRandomGenerateString(int targetStringLength) {
        int leftLimit = 48; // numeral '0'
        int rightLimit = 122; // letter 'z'
        Random random = new Random();
        return random.ints(leftLimit, rightLimit + 1).filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97)).limit(targetStringLength).collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append).toString();
    }

    public static String bytesToHex(byte[] bytes) {
        StringBuilder builder = new StringBuilder();
        for (byte b : bytes) {
            builder.append(String.format("%02x", b));
        }
        return builder.toString();
    }

    public static String getEncryptStr(String str, String salt) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            String text = str + salt;
            md.update(text.getBytes());

            return bytesToHex(md.digest());
        } catch (Exception e) {
            return null;
        }
    }
}
