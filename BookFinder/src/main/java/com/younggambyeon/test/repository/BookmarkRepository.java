package com.younggambyeon.test.repository;

import org.springframework.data.repository.PagingAndSortingRepository;

import com.younggambyeon.test.dto.Bookmark;
import com.younggambyeon.test.dto.User;
import java.util.List;

public interface BookmarkRepository extends PagingAndSortingRepository<Bookmark, Integer> {

	public List<Bookmark> findByUser(User user);

	public Bookmark findByIdx(int idx);

}
