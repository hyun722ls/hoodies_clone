package com.ssafy.hoodies.model.dao;

import com.ssafy.hoodies.model.dto.User;
import org.springframework.stereotype.Repository;

import java.sql.SQLException;
import java.util.Map;

@Repository
public class UserDAOImpl implements UserDAO {
    @Override
    public int checkId(String id) throws SQLException {
        return 0;
    }

    @Override
    public void registUser(Map<String, String> map) throws SQLException {

    }

    @Override
    public void updateUser(Map<String, String> map) throws SQLException {

    }

    @Override
    public void deleteUser(String id) throws SQLException {

    }

    @Override
    public User infoUser(String id) throws SQLException {
        return null;
    }

    @Override
    public User loginUser(String id, String password) throws SQLException {
        return null;
    }

    @Override
    public int checkPasswordFind(Map<String, String> map) throws SQLException {
        return 0;
    }

    @Override
    public void updatePassword(Map<String, String> map) throws SQLException {

    }
}
