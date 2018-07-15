package com.younggambyeon.test.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.younggambyeon.test.dto.User;
import com.younggambyeon.test.service.UserService;

public class CustomUserDetailService implements UserDetailsService {

	private static final Logger logger = LoggerFactory.getLogger(CustomUserDetailService.class);

	@Autowired
	private UserService userService;

	@Override
	public UserDetails loadUserByUsername(String id) throws UsernameNotFoundException {
		User user = null;

		try {
			user = userService.findUserByEmail(id);

		} catch (DataAccessException e) {
			logger.error("#Error => " + e.getMessage());
		}

		if (user == null) {
			throw new UsernameNotFoundException(id);
		}

		CustomUserDetail customUserDetail = new CustomUserDetail();
		customUserDetail.setUser(user);

		return customUserDetail;
	}

}
