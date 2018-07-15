package com.younggambyeon.test.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Repository;

import com.younggambyeon.test.dto.Bookmark;
import com.younggambyeon.test.dto.User;
import com.younggambyeon.test.repository.BookmarkRepository;

@Repository
public class BookmarkDaoImpl implements BookmarkDao {

	@Autowired
	private BookmarkRepository bookmarkRepository;

	@Override
	public List<Bookmark> findBookmarkListByUser(User user) throws DataAccessException {
		return bookmarkRepository.findByUser(user);
	}

	@Override
	public Bookmark findBookmarkByUserAndIsbn(User user, String isbn) throws DataAccessException {
		return bookmarkRepository.findByUserAndIsbn(user, isbn);
	}

	@Override
	public Bookmark findBookmarkByIdx(int idx) throws DataAccessException {
		return bookmarkRepository.findByIdx(idx);
	}

	@Override
	public Bookmark saveBookmark(Bookmark bookmark) throws DataAccessException {
		return bookmarkRepository.save(bookmark);
	}

	@Override
	public void deleteBookmark(Bookmark bookmark) throws DataAccessException {
		bookmarkRepository.delete(bookmark);
	}

}
