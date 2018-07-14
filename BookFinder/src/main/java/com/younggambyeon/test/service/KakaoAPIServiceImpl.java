package com.younggambyeon.test.service;

import java.net.URI;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class KakaoAPIServiceImpl implements KakaoAPIService {

	@Value(value = "#{config['kakao.key']}")
	private String kakaoKey;

	@Override
	public ResponseEntity<?> callAPI(URI uri) {
		HttpHeaders headers = new HttpHeaders();
		headers.add("Authorization", "KakaoAK " + kakaoKey);

		HttpEntity<?> request = new HttpEntity<Object>(headers);
		RestTemplate rest = new RestTemplate();

		try {
			return rest.exchange(uri, HttpMethod.GET, request, String.class);

		} catch (HttpStatusCodeException e) {
			return ResponseEntity.status(e.getStatusCode()).headers(e.getResponseHeaders())
					.body(e.getResponseBodyAsString());
		}
	}

	@Override
	public UriComponentsBuilder getUriBuilder(String type) {
		return UriComponentsBuilder.newInstance().scheme("https").host("dapi.kakao.com").path("v2/search/" + type);
	}

}
