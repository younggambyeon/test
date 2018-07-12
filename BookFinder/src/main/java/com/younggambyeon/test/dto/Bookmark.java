package com.younggambyeon.test.dto;

import java.util.List;

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

	private List<String> authors;

	private String title;
	private String contents;
	private String url;

	private String datetime;
	private String publisher;
	private String category;
	private String thumbnail;

	private Integer price;
	private Integer sale_price;

	public Bookmark() {
		// TODO Auto-generated constructor stub
	}

	public Bookmark(int idx, User user, List<String> authors, String title, String contents, String url,
			String datetime, String publisher, String category, String thumbnail, Integer price, Integer sale_price) {
		this.idx = idx;
		this.user = user;
		this.authors = authors;
		this.title = title;
		this.contents = contents;
		this.url = url;
		this.datetime = datetime;
		this.publisher = publisher;
		this.category = category;
		this.thumbnail = thumbnail;
		this.price = price;
		this.sale_price = sale_price;
	}

	public int getIdx() {
		return idx;
	}

	public void setIdx(int idx) {
		this.idx = idx;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public List<String> getAuthors() {
		return authors;
	}

	public void setAuthors(List<String> authors) {
		this.authors = authors;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getContents() {
		return contents;
	}

	public void setContents(String contents) {
		this.contents = contents;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getDatetime() {
		return datetime;
	}

	public void setDatetime(String datetime) {
		this.datetime = datetime;
	}

	public String getPublisher() {
		return publisher;
	}

	public void setPublisher(String publisher) {
		this.publisher = publisher;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getThumbnail() {
		return thumbnail;
	}

	public void setThumbnail(String thumbnail) {
		this.thumbnail = thumbnail;
	}

	public Integer getPrice() {
		return price;
	}

	public void setPrice(Integer price) {
		this.price = price;
	}

	public Integer getSale_price() {
		return sale_price;
	}

	public void setSale_price(Integer sale_price) {
		this.sale_price = sale_price;
	}

}
