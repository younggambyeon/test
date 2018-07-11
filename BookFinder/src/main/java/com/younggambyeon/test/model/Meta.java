package com.younggambyeon.test.model;

public class Meta {

	private Integer total_count;
	private Integer pageable_count;

	private String is_end;

	public Meta() {
		// TODO Auto-generated constructor stub
	}

	public Meta(Integer total_count, Integer pageable_count, String is_end) {
		this.total_count = total_count;
		this.pageable_count = pageable_count;
		this.is_end = is_end;
	}

	public Integer getTotal_count() {
		return total_count;
	}

	public void setTotal_count(Integer total_count) {
		this.total_count = total_count;
	}

	public Integer getPageable_count() {
		return pageable_count;
	}

	public void setPageable_count(Integer pageable_count) {
		this.pageable_count = pageable_count;
	}

	public String getIs_end() {
		return is_end;
	}

	public void setIs_end(String is_end) {
		this.is_end = is_end;
	}

}
