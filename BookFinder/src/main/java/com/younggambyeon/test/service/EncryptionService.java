package com.younggambyeon.test.service;

import javax.servlet.http.HttpServletRequest;

import com.younggambyeon.test.dto.User;

public interface EncryptionService {

	public void initKeyGenarator(HttpServletRequest request);

	public User decryptUser(HttpServletRequest req, String id, String password);

}
