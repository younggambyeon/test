package com.younggambyeon.test.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.younggambyeon.test.dao.BookmarkDao;
import com.younggambyeon.test.dto.Bookmark;
import com.younggambyeon.test.dto.User;

@Transactional(value = "transactionManager", rollbackFor = { DataAccessException.class })
@Service
public class BookmarkServiceImpl implements BookmarkService {

	@Autowired
	private BookmarkDao bookmarkDao;

	@Override
	public List<Bookmark> findBookmarkListByUser(User user) throws DataAccessException {
		return bookmarkDao.findBookmarkListByUser(user);
	}

	@Override
	public Bookmark findBookmarkByIdx(int idx) throws DataAccessException {
		return bookmarkDao.findBookmarkByIdx(idx);
	}

	@Override
	public Bookmark saveBookmark(Bookmark bookmark) throws DataAccessException {
		return bookmarkDao.saveBookmark(bookmark);
	}

	@Override
	public void deleteBookmark(Bookmark bookmark) throws DataAccessException {
		bookmarkDao.deleteBookmark(bookmark);
	}

}
