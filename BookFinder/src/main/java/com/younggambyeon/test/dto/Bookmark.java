package com.younggambyeon.test.dto;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity(name = "bookmark")
public class Bookmark {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int idx;

	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;

	@Column(length = 1000)
	private String document;

	public Bookmark() {
		// TODO Auto-generated constructor stub
	}

	public Bookmark(int idx, User user, String document) {
		this.idx = idx;
		this.user = user;
		this.document = document;
	}

	public int getIdx() {
		return idx;
	}

	public void setIdx(int idx) {
		this.idx = idx;
	}

	public String getDocument() {
		return document;
	}

	public void setDocument(String document) {
		this.document = document;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

}
