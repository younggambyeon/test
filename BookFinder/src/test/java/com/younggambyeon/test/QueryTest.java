package com.younggambyeon.test;

import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.younggambyeon.test.dto.Bookmark;
import com.younggambyeon.test.dto.User;
import com.younggambyeon.test.model.Document;
import com.younggambyeon.test.repository.BookmarkRepository;
import com.younggambyeon.test.repository.UserRepository;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "file:src/main/webapp/WEB-INF/spring/root-context.xml",
		"file:src/main/webapp/WEB-INF/spring/appServlet/servlet-context.xml",
		"file:src/main/webapp/WEB-INF/spring/appServlet/security-context.xml",
		"file:src/main/webapp/WEB-INF/spring/appServlet/redis-context.xml" })

public class QueryTest {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private BookmarkRepository bookmarkRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Test
	public void saveUser() {
		User user = new User();
		user.setEmail("younggam.byeon@gmail.com");
		user.setPassword(passwordEncoder.encode("test123"));

		user = userRepository.save(user);

		user = findUserByIdx(user.getIdx());

		user = findUserByEmail(user.getEmail());

		saveBookmark(user);
	}

	public User findUserByIdx(int idx) {
		return userRepository.findByIdx(idx);
	}

	public User findUserByEmail(String email) {
		return userRepository.findByEmail(email);
	}

	public void saveBookmark(User user) {
		Bookmark bookmarkA = new Bookmark();
		bookmarkA.setUser(user);

		bookmarkA = bookmarkRepository.save(bookmarkA);

		Bookmark bookmarkB = new Bookmark();
		bookmarkB.setUser(user);

		bookmarkB = bookmarkRepository.save(bookmarkB);

		List<Bookmark> bookmarks = findBookmarkByUser(user);

		deleteBookmark(bookmarkA);
		// deleteUser(user);
	}

	public List<Bookmark> findBookmarkByUser(User user) {
		return bookmarkRepository.findByUser(user);
	}

	public void deleteBookmark(Bookmark bookmark) {
		bookmarkRepository.delete(bookmark);
	}

	public void deleteUser(User user) {
		userRepository.delete(user);
	}

}
