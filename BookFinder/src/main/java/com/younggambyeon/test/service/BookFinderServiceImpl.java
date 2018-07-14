package com.younggambyeon.test.service;

import java.io.UnsupportedEncodingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class BookFinderServiceImpl implements BookFinderService {

	@Autowired
	private KakaoAPIService kakaoAPIService;

	@Override
	public ResponseEntity<?> searchBook(String type, String query, String sort, String target, int page, int size,
			int category) throws UnsupportedEncodingException {

		UriComponentsBuilder builder = kakaoAPIService.getUriBuilder(type);

		if (sort != null && !"".equals(sort)) {
			builder.queryParam("sort", sort);
		}
		if (target != null && !"".equals(target)) {
			builder.queryParam("target", target);
		}
		if (page > 0) {
			builder.queryParam("page", page);
		}
		if (size > 9) {
			builder.queryParam("size", size);
		}
		if (category > -1) {
			builder.queryParam("category", category);
		}

		return kakaoAPIService.callAPI(builder.queryParam("query", query).build().encode().toUri());
	}

}
