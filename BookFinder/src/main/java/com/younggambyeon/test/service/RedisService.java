package com.younggambyeon.test.service;

import java.util.List;

import com.younggambyeon.test.model.History;

public interface RedisService {

	public boolean addHistory(String key, History history);

	public List<History> getHistoryBySortParmeters(String key, long start, long end);

	public void setCache(String key, String json);

	public String getCache(String key);

	public void evitCache(String key);

}
