package com.younggambyeon.test;

import java.io.IOException;
import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.younggambyeon.test.dto.Bookmark;
import com.younggambyeon.test.dto.User;
import com.younggambyeon.test.model.Document;
import com.younggambyeon.test.model.KakaoResponseModel;
import com.younggambyeon.test.repository.BookmarkRepository;
import com.younggambyeon.test.repository.UserRepository;
import com.younggambyeon.test.service.BookFinderService;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "file:src/main/webapp/WEB-INF/spring/root-context.xml",
		"file:src/main/webapp/WEB-INF/spring/appServlet/servlet-context.xml",
		"file:src/main/webapp/WEB-INF/spring/appServlet/security-context.xml",
		"file:src/main/webapp/WEB-INF/spring/appServlet/redis-test-context.xml" })

public class QueryTest {

	private static final Logger logger = LoggerFactory.getLogger(QueryTest.class);

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private BookmarkRepository bookmarkRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private BookFinderService bookFinderService;

	@Test
	public void saveUser() throws JsonParseException, JsonMappingException, IOException {
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

	public KakaoResponseModel searchBook() throws JsonParseException, JsonMappingException, IOException {
		String type = "book";

		ResponseEntity<?> entity = bookFinderService.searchBook(type, "9788980782901", null, "isbn", 0, 10, -1);

		if (HttpStatus.OK.equals(entity.getStatusCode())) {
			ObjectMapper mapper = new ObjectMapper();
			KakaoResponseModel model = mapper.readValue(entity.getBody().toString(), KakaoResponseModel.class);

			logger.info(mapper.writerWithDefaultPrettyPrinter().writeValueAsString(model));

			return model;

		} else {
			logger.error("#Error => Status : " + entity.getStatusCode() + " Header : " + entity.getHeaders() + " Body :"
					+ entity.getBody());
			return null;
		}
	}

	public void saveBookmark(User user) throws JsonParseException, JsonMappingException, IOException {
		Bookmark bookmarkA = new Bookmark();
		bookmarkA.setUser(user);

		Document doc = searchBook().getDocuments().get(0);

		Bookmark bookmark = new Bookmark();
		bookmark.setUser(user);

		bookmark.setIsbn(doc.getIsbn());
		bookmark.setTitle(doc.getTitle());
		bookmark.setContents(doc.getContents());
		bookmark.setAuthors(String.join(",", doc.getAuthors()));
		bookmark.setPublisher(doc.getPublisher());
		bookmark.setCategory(doc.getCategory());
		bookmark.setPrice(doc.getPrice());
		bookmark.setSale_price(doc.getSale_price());
		bookmark.setThumbnail(doc.getThumbnail());
		bookmark.setUrl(doc.getUrl());

		String[] datetime = doc.getDatetime().split("T");
		bookmark.setDatetime(datetime[0]);

		bookmarkA = bookmarkRepository.save(bookmarkA);

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
