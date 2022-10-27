package com.ssafy.hoodies.model.service;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.MessageDigest;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class UserServiceImpl implements UserService {
    @Value("${external.mattermost.login_id}")
    private String login_id;

    @Value("${external.mattermost.password}")
    private String password;

    private static final String URL = "https://meeting.ssafy.com/api/v4/";
    private static final String POST = "POST";
    private static final String CONTENT_TYPE = "applicaiton/json;utf-8";
    private static final String Accept_TYPE = "application/json";

    HttpURLConnection connInit(String subURL, String token) throws IOException {
        URL loginUrl = new URL(URL + subURL);
        HttpURLConnection conn = (HttpURLConnection) loginUrl.openConnection();
        conn.setRequestMethod(POST);
        conn.setRequestProperty("Content-Type", CONTENT_TYPE);
        conn.setRequestProperty("Accept", Accept_TYPE);
        if (token != null)
            conn.setRequestProperty("Authorization", "Bearer " + token);
        conn.setDoOutput(true);

        return conn;
    }

    Map<String, Object> getResponse(HttpURLConnection conn, String sendInfo) throws IOException, ParseException {
        // 데이터 전송
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream()));

        bw.write(sendInfo);
        bw.flush();
        bw.close();

        int responseCode = conn.getResponseCode();

        if (responseCode == HttpURLConnection.HTTP_OK || responseCode == HttpURLConnection.HTTP_CREATED) {
            //서버에서 보낸 응답 데이터 수신 받기
            BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String retStr = in.readLine();

            // 배열 형태인 경우 대괄호 제외
            if (retStr.charAt(0) == '[')
                retStr = retStr.substring(1, retStr.length() - 1);

            JSONParser parser = new JSONParser();
            JSONObject retData = (JSONObject) parser.parse(retStr);
            String id = (String) retData.get("id");
            String token = conn.getHeaderField("Token");

            Map<String, Object> response = new HashMap<>();
            response.put("conn", conn);
            response.put("data", retData);

            return response;
        }
        return null;
    }

    @Override
    public String getRandomGenerateString(int targetStringLength) {
        int leftLimit = 48; // numeral '0'
        int rightLimit = 122; // letter 'z'
        Random random = new Random();
        String generatedString = random.ints(leftLimit, rightLimit + 1).filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97)).limit(targetStringLength).collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append).toString();
        return generatedString;
    }

    @Override
    public String sendMM(String email, int flag) {
        try {
            // 1. 발신자 인증
            HttpURLConnection conn = connInit("users/login", null);

            JSONObject sendInfo = new JSONObject();
            sendInfo.put("login_id", login_id);
            sendInfo.put("password", password);
            String sendData = sendInfo.toString();

            // request 전송
            Map<String, Object> response = getResponse(conn, sendData);

            // response 수신
            JSONObject retData = (JSONObject) response.get("data");
            String myId = (String) retData.get("id");
            String token = (String) conn.getHeaderField("Token");


            // 2. 수신자 정보 조회
            conn = connInit("users/usernames", token);

            // request 전송
            sendData = "[\"" + email.split("@")[0] + "\"]";
            response = getResponse(conn, sendData);

            // response 수신
            retData = (JSONObject) response.get("data");
            String sendId = (String) retData.get("id");


            // 3. 채널 저장
            conn = connInit("channels/direct", token);

            // request 전송
            sendData = "[\"" + myId + "\", \"" + sendId + "\"]";
            response = getResponse(conn, sendData);

            // response 수신
            retData = (JSONObject) response.get("data");
            String channel_id = (String) retData.get("id");


            // 4. 메시지 전송
            conn = connInit("posts", token);

            // request 전송
            sendInfo = new JSONObject();
            sendInfo.put("channel_id", channel_id);

            StringBuilder message = new StringBuilder();
            message.append("#### Hoodies ");
            if (flag == 1)
                message.append("인증 코드입니다.\n");
            else
                message.append("초기화 된 비밀번호 입니다.\n");

            String authcode = getRandomGenerateString(8);
            message.append("```\n").append(authcode).append("\n```");
            System.out.println(message);

            sendInfo.put("message", message.toString());
            sendData = sendInfo.toString();
            response = getResponse(conn, sendData);

            // response 수신
            retData = (JSONObject) response.get("data");
            String response_message = (String) retData.get("message");
            System.out.println(response_message);
            if (message.toString().equals(response_message))
                return authcode;
            else
                return "fail";
        } catch (Exception e) {
            return "fail";
        }
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder builder = new StringBuilder();
        for (byte b : bytes) {
            builder.append(String.format("%02x", b));
        }
        return builder.toString();
    }

    @Override
    public String getEncryptPassword(String password, String salt) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            String text = password + salt;
            md.update(text.getBytes());

            return bytesToHex(md.digest());
        } catch (Exception e) {
            return null;
        }
    }

}
