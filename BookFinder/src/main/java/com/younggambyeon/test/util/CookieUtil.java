package com.younggambyeon.test.util;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class CookieUtil {

	public static String getCookieValue(HttpServletRequest request, String cookieName)
			throws UnsupportedEncodingException {
		Cookie[] cookies = request.getCookies();

		if (cookies == null) {
			return null;
		}

		for (Cookie cookie : cookies) {
			if (cookie.getName().equals(cookieName)) {
				return URLDecoder.decode(cookie.getValue(), "UTF-8");
			}
		}

		return null;
	}

	public static void setCookieValue(HttpServletRequest request, HttpServletResponse response, String cookieName,
			String value) throws UnsupportedEncodingException {

		Cookie[] cookies = request.getCookies();

		if (cookies != null) {
			boolean flag = false;

			for (Cookie cookie : cookies) {
				if (cookie.getName().equals(cookieName)) {
					cookie.setValue(URLEncoder.encode(value, "UTF-8"));
					cookie.setMaxAge(60 * 60 * 24);
					cookie.setPath("/");

					response.addCookie(cookie);
					flag = true;
					break;
				}
			}

			if (flag == false) {
				Cookie cookie = new Cookie(cookieName, URLEncoder.encode(value, "UTF-8"));
				cookie.setPath("/");
				cookie.setMaxAge(60 * 60 * 24);
				response.addCookie(cookie);
			}
		} else {
			Cookie cookie = new Cookie(cookieName, URLEncoder.encode(value, "UTF-8"));
			cookie.setPath("/");
			cookie.setMaxAge(60 * 60 * 24);
			response.addCookie(cookie);
		}
	}

	public static void deleteCookie(HttpServletRequest req, HttpServletResponse resp, String cookieName) {
		Cookie cookie = new Cookie(cookieName, null);

		cookie.setMaxAge(0);
		resp.addCookie(cookie);
	}

	public static void deleteAllCookie(HttpServletRequest req, HttpServletResponse resp) {
		Cookie[] cookie = req.getCookies();

		for (int i = 0; i < cookie.length; i++) {
			cookie[i].setMaxAge(0);
			resp.addCookie(cookie[i]);
		}
	}

}
