package com.younggambyeon.test.service;

import java.io.UnsupportedEncodingException;

import org.springframework.http.ResponseEntity;

public interface BookFinderService {

	public ResponseEntity<?> searchBook(String type, String query, String sort, String target, int page, int size,
			int category) throws UnsupportedEncodingException;

}
