package com.younggambyeon.test.service;

import org.springframework.dao.DataAccessException;

import com.younggambyeon.test.dto.User;

public interface UserService {

	public User findUserByIdx(int idx) throws DataAccessException;

	public User findUserByEmail(String email) throws DataAccessException;

	public User saveUser(User user) throws DataAccessException;

	public void deleteUser(User user) throws DataAccessException;

	public void deleteUserByIdx(int idx) throws DataAccessException;
}
