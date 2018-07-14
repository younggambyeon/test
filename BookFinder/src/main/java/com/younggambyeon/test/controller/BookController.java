package com.younggambyeon.test.controller;

import java.io.IOException;
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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.younggambyeon.test.dto.Bookmark;
import com.younggambyeon.test.dto.User;
import com.younggambyeon.test.model.Document;
import com.younggambyeon.test.model.History;
import com.younggambyeon.test.model.KakaoResponseModel;
import com.younggambyeon.test.security.CustomUserDetail;
import com.younggambyeon.test.service.BookFinderService;
import com.younggambyeon.test.service.BookmarkService;
import com.younggambyeon.test.service.RedisService;
import com.younggambyeon.test.service.UserService;
import com.younggambyeon.test.util.CommonUtil;

@Controller
public class BookController {

	private static final Logger logger = LoggerFactory.getLogger(BookController.class);

	@Autowired
	private UserService userService;

	@Autowired
	private BookFinderService bookFinderService;

	@Autowired
	private BookmarkService bookmarkService;

	@Autowired
	private RedisService redisService;

	@RequestMapping(value = "/home", method = RequestMethod.GET)
	public ModelAndView showHomeView(Authentication auth, ModelAndView mav) {
		CustomUserDetail detail = (CustomUserDetail) auth.getPrincipal();
		User user = detail.getUser();

		mav.addObject("user", user);
		mav.addObject("startPage", 1);

		mav.setViewName("html/home");

		return mav;
	}

	@RequestMapping(value = "/book", method = RequestMethod.GET)
	public ModelAndView searchBook(Authentication auth, HttpServletRequest req, HttpServletResponse resp,
			ModelAndView mav, @RequestParam String keyword, @RequestParam String sort,
			@RequestParam int page, @RequestParam(defaultValue = "-1") int category)
			throws JsonParseException, JsonMappingException, IOException {

		int size = 10;
		CustomUserDetail detail = (CustomUserDetail) auth.getPrincipal();
		User user = detail.getUser();

		ResponseEntity<?> entity = bookFinderService.searchBook("book", keyword, sort, null, page, size, category);

		if (HttpStatus.OK.equals(entity.getStatusCode())) {
			History history = new History();
			history.setKeyword(keyword);
			history.setDate(CommonUtil.getCurrentDate("yyyy-MM-dd HH:mm:ss"));

			redisService.addHistory("account:" + user.getIdx() + ":history", history);

			ObjectMapper mapper = new ObjectMapper();
			KakaoResponseModel model = mapper.readValue(entity.getBody().toString(), KakaoResponseModel.class);

			int totalPages = CommonUtil.getViewPageNumber(size, model.getMeta().getTotal_count());

			mav.addObject("totalPages", totalPages);
			mav.addObject("startPage", page);
			mav.addObject("keyword", keyword);
			mav.addObject("sort", sort);

			mav.addObject("documents", model.getDocuments());
			mav.addObject("user", user);

			mav.setViewName("html/home");

		} else {
			logger.error("#Error => Status : " + entity.getStatusCode() + " Header : " + entity.getHeaders()
					+ " Body : " + entity.getBody());

			mav.addObject("msg", "Error " + entity.getStatusCode());

			mav.setViewName("html/expiredPage");
		}

		return mav;
	}

	/* ---- bookmark ---- */

	@RequestMapping(value = "/bookmark", method = RequestMethod.GET)
	public ModelAndView showBookmarkView(Authentication auth, ModelAndView mav) {
		CustomUserDetail detail = (CustomUserDetail) auth.getPrincipal();
		User user = detail.getUser();

		List<Bookmark> bookmarkList = bookmarkService.findBookmarkListByUser(user);

		mav.addObject("user", user);
		mav.addObject("bookmarkList", bookmarkList);

		mav.setViewName("html/bookmark");

		return mav;
	}

	@RequestMapping(value = "/user/{idx}/bookmark", method = RequestMethod.POST)
	public @ResponseBody String saveBookmark(@PathVariable int idx, @RequestBody Document doc)
			throws JsonParseException, JsonMappingException, IOException {

		User user = userService.findUserByIdx(idx);
		if (user == null) {
			return "fail";
		}

		String isbn = CommonUtil.extractBookIsbn(doc.getIsbn());
		if (0 < bookmarkService.findBookmarkListByIsbn(doc.getIsbn()).size()) {
			return "duplicate bookmarks";
		}

		ResponseEntity<?> entity = bookFinderService.searchBook("book", isbn, null, "isbn", 0, 9, -1);

		if (HttpStatus.OK.equals(entity.getStatusCode())) {
			ObjectMapper mapper = new ObjectMapper();
			KakaoResponseModel model = mapper.readValue(entity.getBody().toString(), KakaoResponseModel.class);

			if (0 == model.getDocuments().size()) {
				return "fail";
			}

			bookmarkService.saveBookmark(model, user);

			return "success";

		} else {
			logger.error("#Error => Status : " + entity.getStatusCode() + " Header : " + entity.getHeaders()
					+ " Body : " + entity.getBody());

			return "fail";
		}
	}

	@RequestMapping(value = "/user/{idx}/bookmark", method = RequestMethod.DELETE)
	public @ResponseBody String removeBookmark(@PathVariable int idx, @RequestBody Document doc)
			throws JsonParseException, JsonMappingException, IOException {

		User user = userService.findUserByIdx(idx);
		if (user == null) {
			return "fail";
		}

		List<Bookmark> bookmarks = bookmarkService.findBookmarkListByIsbn(doc.getIsbn());
		if (0 == bookmarks.size()) {
			return "fail";
		}

		Bookmark bookmark = bookmarks.get(0);
		bookmarkService.deleteBookmark(bookmark);

		return "success";
	}

	/* ---- history ---- */

	@RequestMapping(value = "/history", method = RequestMethod.GET)
	public ModelAndView showHistorykView(Authentication auth, ModelAndView mav) {
		CustomUserDetail detail = (CustomUserDetail) auth.getPrincipal();
		User user = detail.getUser();

		List<History> historys = redisService.getHistoryBySortParmeters("account:" + user.getIdx() + ":history", 0, 14);

		mav.addObject("user", user);
		mav.addObject("historys", historys);

		mav.setViewName("html/history");

		return mav;
	}

}
