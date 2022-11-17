package com.ssafy.hoodies.model.service;

import com.ssafy.hoodies.model.entity.User;
import com.ssafy.hoodies.model.entity.UserAuth;
import com.ssafy.hoodies.model.repository.UserAuthRepository;
import com.ssafy.hoodies.model.repository.UserRepository;
import com.ssafy.hoodies.util.util;
import lombok.RequiredArgsConstructor;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    @Value("${external.mattermost.login_id}")
    private String login_id;

    @Value("${external.mattermost.password}")
    private String password;

    private static final String URL = "https://meeting.ssafy.com/api/v4/";
    private static final String POST = "POST";
    private static final String CONTENT_TYPE = "applicaiton/json;utf-8";
    private static final String Accept_TYPE = "application/json";

    private static final String SUCCESS = "success";
    private static final String FAIL = "fail";

    private final UserRepository userRepository;
    private final UserAuthRepository userAuthRepository;

    @Override
    public int checkNickname(String nickname) {
        User user = userRepository.findByNickname(nickname);
        int cnt = 1;
        cnt = user == null ? 0 : 1;

        return cnt;
    }

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

            Map<String, Object> response = new HashMap<>();
            response.put("conn", conn);
            response.put("data", retData);

            return response;
        }
        return null;
    }

    @Override
    public String sendMM(String email, int flag) {
        String emailId = email.split("@")[0];

        // 기존 user가 있는 경우
        if (!userRepository.findByEmailStartsWith(emailId + "@").isEmpty())
            return FAIL;

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
            sendData = "[\"" + emailId + "\"]";
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
                message.append("초기화된 비밀번호입니다.\n");

            String authcode = util.getRandomGenerateString(8);
            message.append("```\n").append(authcode).append("\n```");

            sendInfo.put("message", message.toString());
            sendData = sendInfo.toString();
            response = getResponse(conn, sendData);

            // response 수신
            retData = (JSONObject) response.get("data");
            String response_message = (String) retData.get("message");

            if (message.toString().equals(response_message)) {
                Timestamp expireTime = new Timestamp(System.currentTimeMillis());
                expireTime.setTime(expireTime.getTime() + TimeUnit.MINUTES.toMillis(3));
                userAuthRepository.save(UserAuth.builder().email(email).authcode(authcode).time(expireTime).authflag(false).build());
                return SUCCESS;
            } else
                return FAIL;
        } catch (Exception e) {
            return FAIL;
        }
    }

    @Override
    public boolean authMM(String email, String authcode) {
        String emailId = email.split("@")[0];

        // 기존 user가 있는 경우
        if (!userRepository.findByEmailStartsWith(emailId + "@").isEmpty())
            return false;

        UserAuth userAuth = userAuthRepository.findByEmailAndAuthcode(email, authcode);
        if (userAuth == null)
            return false;

        Timestamp nowTime = new Timestamp(System.currentTimeMillis());
        Timestamp time = userAuth.getTime();

        // 제한시간이 만료되었을 경우
        if (!nowTime.before(time))
            return false;

        // 인증 성공
        userAuth.setAuthflag(true);
        userAuthRepository.save(userAuth);

        return true;
    }

    public String findNickname(String email) {
        User user = userRepository.findById(email).orElse(null);
        if (user == null) return "";
        else return user.getNickname();
    }

}
