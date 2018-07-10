package com.younggambyeon.test.security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;

public class LoginFailureHandler extends SimpleUrlAuthenticationFailureHandler {

	private static final Logger logger = LoggerFactory.getLogger(LoginFailureHandler.class);

	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException auth) throws IOException, ServletException {

		if (auth instanceof BadCredentialsException) {
			request.setAttribute("loginError", "아이디 또는 비밀번호를 다시 확인하세요.");
			request.getRequestDispatcher("/login").forward(request, response);
		} else {
			request.setAttribute("loginError", "알 수 없는 오류가 발생 하였습니다.");
			request.getRequestDispatcher("/login").forward(request, response);

			logger.error("#Error => " + auth.getMessage());
		}

		logger.info(auth.getMessage());
	}
}
