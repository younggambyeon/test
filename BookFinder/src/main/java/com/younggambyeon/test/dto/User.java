package com.younggambyeon.test.dto;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

@Entity(name = "user")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int idx;

	@Column(unique = true, nullable = false)
	private String email;

	@Column(nullable = false)
	private String password;

	@OneToMany(mappedBy = "user", cascade = { CascadeType.REMOVE })
	private List<Bookmark> bookmark;

	public User() {
		// TODO Auto-generated constructor stub
	}

	public User(int idx, String email, String password, List<Bookmark> bookmark) {
		this.idx = idx;
		this.email = email;
		this.password = password;
		this.bookmark = bookmark;
	}

	public int getIdx() {
		return idx;
	}

	public void setIdx(int idx) {
		this.idx = idx;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public List<Bookmark> getBookmark() {
		return bookmark;
	}

	public void setBookmark(List<Bookmark> bookmark) {
		this.bookmark = bookmark;
	}

}
