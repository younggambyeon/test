package com.younggambyeon.test.service;

import java.net.URI;

import org.springframework.http.ResponseEntity;
import org.springframework.web.util.UriComponentsBuilder;

public interface KakaoAPIService {

	public ResponseEntity<?> callAPI(URI uri);

	public UriComponentsBuilder getUriBuilder(String type);

}
