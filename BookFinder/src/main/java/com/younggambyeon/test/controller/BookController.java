package com.younggambyeon.test.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.younggambyeon.test.dto.User;
import com.younggambyeon.test.security.CustomUserDetail;
import com.younggambyeon.test.service.UserService;

@Controller
public class BookController {

	private static final Logger logger = LoggerFactory.getLogger(BookController.class);

	@Autowired
	private UserService userService;

	@RequestMapping(value = "/home")
	public ModelAndView joinView(Authentication auth, ModelAndView mav) {
		CustomUserDetail detail = (CustomUserDetail) auth.getPrincipal();

		String email = detail.getUsername();

		User user = userService.findUserByEmail(email);

		mav.setViewName("html/home");
		mav.addObject("user", user);

		return mav;
	}
}
