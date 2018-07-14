package com.younggambyeon.test.model;

public class History {

	private String keyword;
	private String date;

	public History() {
		// TODO Auto-generated constructor stub
	}

	public History(String keyword, String date) {
		this.keyword = keyword;
		this.date = date;
	}

	public String getKeyword() {
		return keyword;
	}

	public void setKeyword(String keyword) {
		this.keyword = keyword;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

}
