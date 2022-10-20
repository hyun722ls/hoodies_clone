package com.ssafy.hoodies.model.service;

import com.ssafy.hoodies.model.dao.UserDAO;
import com.ssafy.hoodies.model.dto.User;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class UserServiceImpl implements UserService {
    private final UserDAO userDao;

    private UserServiceImpl(UserDAO userDao) {
        this.userDao = userDao;
    }

    @Override
    public int checkId(String id) throws Exception {
        return userDao.checkId(id);
    }

    @Override
    public void registUser(Map<String, String> map) throws Exception {
        map.put("salt", randomGenerateString(16));
        userDao.registUser(map);
    }

    @Override
    public void updateUser(Map<String, String> map) throws Exception {
        map.put("salt", randomGenerateString(16));
        userDao.updateUser(map);
    }

    @Override
    public void deleteUser(String id) throws Exception {
        userDao.deleteUser(id);
    }

    @Override
    public User infoUser(String id) throws Exception {
        return userDao.infoUser(id);
    }

    @Override
    public User loginUser(String id, String password) throws Exception {
        return userDao.loginUser(id, password);
    }

    @Override
    public int checkPasswordFind(String id, String email) throws Exception {
        Map<String, String> map = new HashMap<>();
        map.put("id", id);
        map.put("email", email);
        int cnt = userDao.checkPasswordFind(map);
        if (cnt == 1) {
            map.put("salt", randomGenerateString(16));
            String newPassword = randomGenerateString(5);
            map.put("password", newPassword);
            userDao.updatePassword(map);
        }
        return cnt;
    }

    @Override
    public void updatePassword(String id) throws Exception {
        Map<String, String> map = new HashMap<>();
        map.put("id", id);
        map.put("password", randomGenerateString(8));
        map.put("salt", randomGenerateString(16));
        userDao.updatePassword(map);
    }

    public String randomGenerateString(int targetStringLength) {
        int leftLimit = 48; // numeral '0'
        int rightLimit = 122; // letter 'z'
        Random random = new Random();
        String generatedString = random.ints(leftLimit, rightLimit + 1).filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97)).limit(targetStringLength).collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append).toString();
        return generatedString;
    }

}
