package com.younggambyeon.test.handler;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.ModelAndView;

@ControllerAdvice("com.younggambyeon.test")
public class CommonExceptionHandler {

	private static final Logger logger = LoggerFactory.getLogger(CommonExceptionHandler.class);

	@ExceptionHandler(Exception.class)
	public ModelAndView defaultException(HttpServletRequest req, Exception exception) {
		logger.error("Request: " + req.getRequestURL() + " Exception :" + exception);

		ModelAndView mav = new ModelAndView();
		mav.setViewName("html/expiredPage");

		return mav;
	}
}
