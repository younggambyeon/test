package com.younggambyeon.test.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;

import com.younggambyeon.test.dto.User;
import com.younggambyeon.test.repository.UserRepository;

public class UserDaoImpl implements UserDao {

	@Autowired
	private UserRepository userRepository;

	@Override
	public User findUserByIdx(int idx) throws DataAccessException {
		return userRepository.findByIdx(idx);
	}

	@Override
	public User findUserByEmail(String email) throws DataAccessException {
		return userRepository.findByEmail(email);
	}

	@Override
	public User saveUser(User user) throws DataAccessException {
		return userRepository.save(user);
	}

	@Override
	public void deleteUser(User user) throws DataAccessException {
		userRepository.delete(user);
	}

	@Override
	public void deleteUserByIdx(int idx) throws DataAccessException {
		userRepository.delete(idx);
	}

}
