package com.younggambyeon.test.model;

import java.util.List;

public class Document {

	private List<String> authors;
	private List<String> translators;

	private String title;
	private String contents;
	private String url;
	private String isbn;

	private String datetime;
	private String publisher;
	private String category;
	private String thumbnail;

	private String barcode;
	private String ebook_barcode;

	private String status;
	private String sale_yn;

	private Integer price;
	private Integer sale_price;

	public Document() {
		// TODO Auto-generated constructor stub
	}

	public Document(List<String> authors, List<String> translators, String title, String contents, String url,
			String isbn, String datetime, String publisher, String category, String thumbnail, String barcode,
			String ebook_barcode, String status, String sale_yn, Integer price, Integer sale_price) {
		this.authors = authors;
		this.translators = translators;
		this.title = title;
		this.contents = contents;
		this.url = url;
		this.isbn = isbn;
		this.datetime = datetime;
		this.publisher = publisher;
		this.category = category;
		this.thumbnail = thumbnail;
		this.barcode = barcode;
		this.ebook_barcode = ebook_barcode;
		this.status = status;
		this.sale_yn = sale_yn;
		this.price = price;
		this.sale_price = sale_price;
	}

	public List<String> getAuthors() {
		return authors;
	}

	public void setAuthors(List<String> authors) {
		this.authors = authors;
	}

	public List<String> getTranslators() {
		return translators;
	}

	public void setTranslators(List<String> translators) {
		this.translators = translators;
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

	public String getIsbn() {
		return isbn;
	}

	public void setIsbn(String isbn) {
		this.isbn = isbn;
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

	public String getBarcode() {
		return barcode;
	}

	public void setBarcode(String barcode) {
		this.barcode = barcode;
	}

	public String getEbook_barcode() {
		return ebook_barcode;
	}

	public void setEbook_barcode(String ebook_barcode) {
		this.ebook_barcode = ebook_barcode;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getSale_yn() {
		return sale_yn;
	}

	public void setSale_yn(String sale_yn) {
		this.sale_yn = sale_yn;
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
