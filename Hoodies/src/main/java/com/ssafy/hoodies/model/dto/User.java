package com.back.miru.model.dto;

import java.util.List;

public class User {
	private String id;
	private String password;
	private String email;
	private int recommendFlag;

	public User(String id, String password, String email, int recommendFlag) {
		this.id = id;
		this.password = password;
		this.email = email;
		this.recommendFlag = recommendFlag;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public int getRecommendFlag() {
		return recommendFlag;
	}

	public void setRecommendFlag(int recommendFlag) {
		this.recommendFlag = recommendFlag;
	}
}
