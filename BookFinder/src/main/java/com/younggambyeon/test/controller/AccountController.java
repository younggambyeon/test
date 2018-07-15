package com.younggambyeon.test.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.younggambyeon.test.dto.User;
import com.younggambyeon.test.service.EncryptionService;
import com.younggambyeon.test.service.UserService;

@Controller
public class AccountController {

	@Autowired
	private UserService userService;

	@Autowired
	private EncryptionService encryptionService;

	@RequestMapping(value = { "/login", "/" })
	public String login(HttpServletRequest req) {
		return "html/login";
	}

	@RequestMapping(value = "/join", method = RequestMethod.GET)
	public String joinView(HttpServletRequest req) {
		encryptionService.initKeyGenarator(req);

		return "html/signup";
	}

	@RequestMapping(value = "/join", method = RequestMethod.POST)
	public @ResponseBody String joinUser(@RequestBody User user, HttpServletRequest req) {

		String id = user.getEmail();
		String password = user.getPassword();

		user = encryptionService.decryptUser(req, id, password);

		User Userduplication = userService.findUserByEmail(user.getEmail());
		if (Userduplication != null) {
			return "duplicate user";
		}

		userService.saveUser(user);

		return "success";
	}

}
