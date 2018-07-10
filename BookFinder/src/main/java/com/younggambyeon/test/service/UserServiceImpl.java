package com.younggambyeon.test.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import com.younggambyeon.test.dao.UserDao;
import com.younggambyeon.test.dto.User;

@Transactional(value = "transactionManager", rollbackFor = { DataAccessException.class })
public class UserServiceImpl implements UserService {

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private UserDao userDao;

	@Override
	public User findUserByIdx(int idx) throws DataAccessException {
		return userDao.findUserByIdx(idx);
	}

	@Override
	public User findUserByEmail(String email) throws DataAccessException {
		return userDao.findUserByEmail(email);
	}

	@Override
	public User saveUser(User user) throws DataAccessException {
		user.setPassword(passwordEncoder.encode(user.getPassword()));

		return userDao.saveUser(user);
	}

	@Override
	public void deleteUser(User user) throws DataAccessException {
		userDao.deleteUser(user);
	}

	@Override
	public void deleteUserByIdx(int idx) throws DataAccessException {
		userDao.deleteUserByIdx(idx);
	}

}
