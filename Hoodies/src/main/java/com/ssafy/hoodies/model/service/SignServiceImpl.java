package com.ssafy.hoodies.model.service;

import com.ssafy.hoodies.model.Role;
import com.ssafy.hoodies.model.entity.User;
import com.ssafy.hoodies.model.entity.UserAuth;
import com.ssafy.hoodies.model.repository.UserAuthRepository;
import com.ssafy.hoodies.model.repository.UserRepository;
import com.ssafy.hoodies.util.util;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SignServiceImpl implements SignService {
    private static final String SUCCESS = "success";
    private static final String FAIL = "fail";

    private final UserRepository userRepository;
    private final UserAuthRepository userAuthRepository;

    @Override
    public String signup(User user) {
        String emailId = user.getEmail().split("@")[0];

        // 기존 user가 있는 경우
        if (!userRepository.findByEmailStartsWith(emailId + "@").isEmpty())
            return FAIL;

        // 기존 닉네임이 있는 경우
        if (userRepository.findByNickname(user.getNickname()) != null)
            return FAIL;

        try {
            UserAuth userAuth = userAuthRepository.findById(user.getEmail()).get();

            // 인증되지 않은 경우
            if (!userAuth.isAuthflag())
                return FAIL;

            String salt = util.getRandomGenerateString(8);
            String encryptPassword = util.getEncryptStr(user.getPassword(), salt);
            if (encryptPassword == null)
                return FAIL;

            user.setSalt(salt);
            user.setPassword(encryptPassword);
            user.setRole(Role.ROLE_USER);
            userRepository.save(user);

            return SUCCESS;
        } catch (Exception e) {
            return FAIL;
        }
    }

}
