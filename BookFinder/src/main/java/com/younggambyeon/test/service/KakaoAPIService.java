package com.younggambyeon.test.service;

import org.springframework.http.ResponseEntity;
import org.springframework.web.util.UriComponentsBuilder;

public interface KakaoAPIService {

	public ResponseEntity<?> callAPI(UriComponentsBuilder builder);

	public UriComponentsBuilder getUriBuilder(String type);

}
