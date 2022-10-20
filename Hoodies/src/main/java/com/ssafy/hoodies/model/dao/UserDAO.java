package com.ssafy.hoodies.model.dao;

import com.ssafy.hoodies.model.dto.User;
import org.springframework.stereotype.Repository;

import java.sql.SQLException;
import java.util.Map;

@Repository
public interface UserDAO {
	int checkId(String id) throws SQLException;

	void registUser(Map<String, String> map) throws SQLException;

	void updateUser(Map<String, String> map) throws SQLException;

	void deleteUser(String id) throws SQLException;

	User infoUser(String id) throws SQLException;

	User loginUser(String id, String password) throws SQLException;

	int checkPasswordFind(Map<String, String> map) throws SQLException;

	void updatePassword(Map<String, String> map) throws SQLException;

}