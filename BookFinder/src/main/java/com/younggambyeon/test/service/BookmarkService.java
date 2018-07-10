package com.younggambyeon.test.service;

import java.util.List;

import org.springframework.dao.DataAccessException;

import com.younggambyeon.test.dto.Bookmark;
import com.younggambyeon.test.dto.User;

public interface BookmarkService {

	public List<Bookmark> findBookmarkListByUser(User user) throws DataAccessException;

	public Bookmark findBookmarkByIdx(int idx) throws DataAccessException;

	public Bookmark saveBookmark(Bookmark bookmark) throws DataAccessException;

	public void deleteBookmark(Bookmark bookmark) throws DataAccessException;

}
