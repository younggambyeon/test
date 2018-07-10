package com.younggambyeon.test.security;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

public class LoginSuccessHandler implements AuthenticationSuccessHandler {

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication auth)
			throws IOException, ServletException {

		// CustomUserDetail userDetail = (CustomUserDetail) auth.getPrincipal();
		// User user = userDetail.getUser();

		String contextPath = request.getContextPath();
		response.sendRedirect(contextPath + "/home");
	}
}
