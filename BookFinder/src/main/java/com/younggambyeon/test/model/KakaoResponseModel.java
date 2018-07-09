package com.younggambyeon.test.model;

import java.util.List;

public class KakaoResponseModel {

	private Meta meta;

	private List<Document> documents;

	public KakaoResponseModel() {
		// TODO Auto-generated constructor stub
	}

	public KakaoResponseModel(Meta meta, List<Document> documents) {
		this.meta = meta;
		this.documents = documents;
	}

	public Meta getMeta() {
		return meta;
	}

	public void setMeta(Meta meta) {
		this.meta = meta;
	}

	public List<Document> getDocuments() {
		return documents;
	}

	public void setDocuments(List<Document> documents) {
		this.documents = documents;
	}

}
