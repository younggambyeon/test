package com.younggambyeon.test.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.redis.connection.SortParameters;
import org.springframework.data.redis.connection.SortParameters.Range;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.query.SortQuery;
import org.springframework.data.redis.core.query.SortQueryBuilder;
import org.springframework.stereotype.Service;

import com.younggambyeon.test.model.History;

@Service
public class RedisServiceImpl implements RedisService {

	@Autowired
	private RedisTemplate<String, String> redisTemplate;

	@Autowired
	private RedisTemplate<String, History> historyRedisTemplate;

	@Override
	public boolean addHistory(String key, History history) {
		return historyRedisTemplate.boundZSetOps(key).add(history, 1);
	}

	@Override
	public List<History> getHistoryBySortParmeters(String key, long start, long end) {
		SortQuery<String> sortQuery = SortQueryBuilder.sort(key).by("hash*->date").order(SortParameters.Order.DESC)
				.limit(new Range(start, end)).build();

		return historyRedisTemplate.boundZSetOps(key).getOperations().sort(sortQuery);
	}

	@CachePut(value = "finder:cache")
	@Override
	public void setCache(String key, String json) {
		redisTemplate.opsForValue().set(key, json);
	}

	@Cacheable(value = "finder:cache")
	@Override
	public String getCache(String key) {
		return redisTemplate.opsForValue().get(key);
	}

	@CacheEvict(value = "finder:cache", allEntries = true)
	@Override
	public void evitCache(String key) {
		redisTemplate.delete(key);
	}

}
