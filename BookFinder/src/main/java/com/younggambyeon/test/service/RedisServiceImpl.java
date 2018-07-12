package com.younggambyeon.test.service;

import java.util.Set;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class RedisServiceImpl implements RedisService {

	@Autowired
	private RedisTemplate<String, String> redisTemplate;

	@Resource(name = "redisTemplate")
	private ListOperations<String, String> listOps;

	@Override
	public Object getValue(String key) {
		return redisTemplate.opsForValue().get(key);
	}

	@Override
	public void setValue(String key, String value) {
		redisTemplate.opsForValue().set(key, value);
	}

	@Override
	public void addOpsForSetBykeyAndValues(String key, String value) {
		redisTemplate.opsForSet().add(key, value);
	}

	@Override
	public Set<String> getOpsForSetMembers(String key) {
		return redisTemplate.opsForSet().members(key);
	}

	@Override
	public void deleteBykey(String key) {
		redisTemplate.delete(key);
	}

	@Override
	public void lpush(String key, String value) {
		listOps.leftPush(key, value);
	}

	@Override
	public String lpop(String key) {
		return listOps.leftPop(key);
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
