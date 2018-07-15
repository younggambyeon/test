package com.younggambyeon.test.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.younggambyeon.test.dao.BookmarkDao;
import com.younggambyeon.test.dto.Bookmark;
import com.younggambyeon.test.dto.User;
import com.younggambyeon.test.model.Document;
import com.younggambyeon.test.model.KakaoResponseModel;

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
	public Bookmark findBookmarkByUserAndIsbn(User user, String isbn) throws DataAccessException {
		return bookmarkDao.findBookmarkByUserAndIsbn(user, isbn);
	}

	@Override
	public Bookmark findBookmarkByIdx(int idx) throws DataAccessException {
		return bookmarkDao.findBookmarkByIdx(idx);
	}

	@Override
	public Bookmark saveBookmark(KakaoResponseModel model, User user)
			throws DataAccessException, JsonProcessingException {
		Document doc = model.getDocuments().get(0);

		Bookmark bookmark = new Bookmark();
		bookmark.setUser(user);

		bookmark.setIsbn(doc.getIsbn());
		bookmark.setTitle(doc.getTitle());
		bookmark.setContents(doc.getContents());
		bookmark.setAuthors(String.join(",", doc.getAuthors()));
		bookmark.setPublisher(doc.getPublisher());
		bookmark.setCategory(doc.getCategory());
		bookmark.setPrice(doc.getPrice());
		bookmark.setSale_price(doc.getSale_price());
		bookmark.setThumbnail(doc.getThumbnail());
		bookmark.setUrl(doc.getUrl());

		String[] datetime = doc.getDatetime().split("T");
		bookmark.setDatetime(datetime[0]);

		return bookmarkDao.saveBookmark(bookmark);
	}

	@Override
	public void deleteBookmark(Bookmark bookmark) throws DataAccessException {
		bookmarkDao.deleteBookmark(bookmark);
	}

}
