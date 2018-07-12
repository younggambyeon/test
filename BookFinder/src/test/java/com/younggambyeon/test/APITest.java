package com.younggambyeon.test;

import java.io.IOException;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.younggambyeon.test.model.KakaoResponseModel;
import com.younggambyeon.test.service.BookFinderService;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "file:src/main/webapp/WEB-INF/spring/root-context.xml",
		"file:src/main/webapp/WEB-INF/spring/appServlet/servlet-context.xml",
		"file:src/main/webapp/WEB-INF/spring/appServlet/security-context.xml",
		"file:src/main/webapp/WEB-INF/spring/appServlet/redis-context.xml" })

@WebAppConfiguration
public class APITest {

	private static final Logger logger = LoggerFactory.getLogger(APITest.class);

	@Autowired
	private BookFinderService bookFinderService;

	/**
	 * @param page
	 *            => X(기본 1)
	 * @param size
	 *            => X(기본 10)
	 * @param category
	 *            => X(0~테이블 참조)
	 */
	@Test
	public void searchBook() throws JsonParseException, JsonMappingException, IOException {
		String type = "book";

		ResponseEntity<?> entity = bookFinderService.searchBook(type, "JPA", null, null, 0, 10, -1);

		if (HttpStatus.OK.equals(entity.getStatusCode())) {
			ObjectMapper mapper = new ObjectMapper();
			KakaoResponseModel model = mapper.readValue(entity.getBody().toString(), KakaoResponseModel.class);

			logger.info(mapper.writerWithDefaultPrettyPrinter().writeValueAsString(model));

		} else {
			logger.error("#Error => Status : " + entity.getStatusCode() + " Header : " + entity.getHeaders() + " Body :"
					+ entity.getBody());
		}
	}

}
