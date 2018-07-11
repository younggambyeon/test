package com.younggambyeon.test.controller;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.younggambyeon.test.model.KakaoResponseModel;
import com.younggambyeon.test.security.CustomUserDetail;
import com.younggambyeon.test.service.BookFinderService;
import com.younggambyeon.test.service.UserService;
import com.younggambyeon.test.util.CookieUtil;

@Controller
public class BookController {

	private static final Logger logger = LoggerFactory.getLogger(BookController.class);

	@Autowired
	private UserService userService;

	@Autowired
	private BookFinderService bookFinderService;

	@RequestMapping(value = "/home", method = RequestMethod.GET)
	public ModelAndView showHomeView(Authentication auth, ModelAndView mav) {
		CustomUserDetail detail = (CustomUserDetail) auth.getPrincipal();
		String email = detail.getUsername();

		mav.addObject("email", email);
		mav.addObject("page", 1);

		mav.setViewName("html/home");

		return mav;
	}

	@RequestMapping(value = "/book", method = RequestMethod.GET)
	public ModelAndView searchBook(Authentication auth, HttpServletRequest req, HttpServletResponse resp,
			ModelAndView mav, @RequestParam String keyword, @RequestParam int page,
			@RequestParam(defaultValue = "-1") int category)
			throws JsonParseException, JsonMappingException, IOException {

		int size = 10;
		page = (page - 1) * size;

		CustomUserDetail detail = (CustomUserDetail) auth.getPrincipal();
		ObjectMapper mapper = new ObjectMapper();
		recordKeywordHistory(keyword, req, resp, mapper);

		ResponseEntity<?> entity = bookFinderService.searchBook("book", keyword, null, null, page, size, category);

		if (HttpStatus.OK.equals(entity.getStatusCode())) {
			KakaoResponseModel model = mapper.readValue(entity.getBody().toString(), KakaoResponseModel.class);

			mav.addObject("isEnd", model.getMeta().getIs_end());
			mav.addObject("page", page);
			mav.addObject("documents", model.getDocuments());
			mav.addObject("keyword", keyword);
			mav.addObject("email", detail.getUsername());

			mav.setViewName("html/home");

		} else {
			logger.error("#Error => Status : " + entity.getStatusCode() + " Header : " + entity.getHeaders()
					+ " Body : " + entity.getBody());

			mav.addObject("msg", "Error " + entity.getStatusCode());

			mav.setViewName("html/expiredPage");
		}

		return mav;
	}

	@RequestMapping(value = "/book/history", method = RequestMethod.GET)
	public @ResponseBody String getHistory(HttpServletRequest req, HttpServletResponse resp)
			throws JsonParseException, JsonMappingException, IOException {

		String cookie = CookieUtil.getCookieValue(req, "search_history");

		if (cookie != null && cookie != "") {
			return cookie;
		}

		return "";
	}

	private void recordKeywordHistory(String keyword, HttpServletRequest req, HttpServletResponse resp,
			ObjectMapper mapper) throws UnsupportedEncodingException, IOException, JsonParseException,
			JsonMappingException, JsonProcessingException {

		String cookie = CookieUtil.getCookieValue(req, "search_history");

		List<String> keywordList = new ArrayList<String>();
		if (cookie != null && cookie != "") {
			keywordList = mapper.readValue(cookie, new TypeReference<ArrayList<String>>() {
			});
		}

		keywordList.add(keyword);
		cookie = mapper.writeValueAsString(keywordList);

		CookieUtil.setCookieValue(req, resp, "search_history", cookie);
	}

}
