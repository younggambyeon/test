package com.younggambyeon.test.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.younggambyeon.test.dto.User;
import com.younggambyeon.test.service.UserService;

@Controller
public class AccountController {

	@Autowired
	private UserService userService;

	@RequestMapping(value = { "/login", "/" })
	public String login() {
		return "html/login";
	}

	@RequestMapping(value = "/join", method = RequestMethod.GET)
	public String joinView() {
		return "html/signup";
	}

	@RequestMapping(value = "/join", method = RequestMethod.POST)
	public @ResponseBody String joinUser(@RequestBody User user) {
		// 비밀번호 복호화
		// 이메일, 비밀번호 확인 필요
		User Userduplication = userService.findUserByEmail(user.getEmail());
		if (Userduplication != null) {
			return "duplicate user";
		}

		userService.saveUser(user);

		return "success";
	}

}
