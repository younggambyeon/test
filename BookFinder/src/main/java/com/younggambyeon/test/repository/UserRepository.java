package com.younggambyeon.test.repository;

import org.springframework.data.repository.PagingAndSortingRepository;

import com.younggambyeon.test.dto.User;
import java.lang.String;

public interface UserRepository extends PagingAndSortingRepository<User, Integer> {

	public User findByEmail(String email);

	public User findByIdx(int idx);
	
}
