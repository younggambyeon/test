package com.younggambyeon.test.service;

import java.util.List;

import org.springframework.dao.DataAccessException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.younggambyeon.test.dto.Bookmark;
import com.younggambyeon.test.dto.User;
import com.younggambyeon.test.model.KakaoResponseModel;

public interface BookmarkService {

	public List<Bookmark> findBookmarkListByUser(User user) throws DataAccessException;

	public List<Bookmark> findBookmarkListByIsbn(String isbn) throws DataAccessException;

	public Bookmark findBookmarkByIdx(int idx) throws DataAccessException;

	public Bookmark saveBookmark(KakaoResponseModel model, User user)
			throws DataAccessException, JsonProcessingException;

	public void deleteBookmark(Bookmark bookmark) throws DataAccessException;

}
