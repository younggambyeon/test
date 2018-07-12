package com.younggambyeon.test.service;

import java.util.Set;

public interface RedisService {

	public Object getValue(String key);

	public void setValue(String key, String value);

	public void addOpsForSetBykeyAndValues(String key, String value);

	public Set<String> getOpsForSetMembers(String key);

	public void deleteBykey(String key);

	public void lpush(String key, String value);

	public String lpop(String key);

	public void setCache(String key, String json);

	public String getCache(String key);

	public void evitCache(String key);

}
