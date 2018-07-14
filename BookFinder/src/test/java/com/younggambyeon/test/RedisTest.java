package com.younggambyeon.test;

import java.util.List;

import javax.annotation.Resource;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.SortParameters;
import org.springframework.data.redis.connection.SortParameters.Range;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.query.SortQuery;
import org.springframework.data.redis.core.query.SortQueryBuilder;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.younggambyeon.test.model.History;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "file:src/main/webapp/WEB-INF/spring/root-context.xml",
		"file:src/main/webapp/WEB-INF/spring/appServlet/servlet-context.xml",
		"file:src/main/webapp/WEB-INF/spring/appServlet/security-context.xml",
		"file:src/main/webapp/WEB-INF/spring/appServlet/redis-context.xml" })

public class RedisTest {

	@Autowired
	private RedisTemplate<String, History> historyRedisTemplate;

	@Resource(name = "redisTemplate")
	private ListOperations<String, History> historyListOps;

	@Test
	public void recordHistory() {
		String key = "account:1:history";

		SortQuery<String> sortQuery = SortQueryBuilder.sort(key).by("hash*->date").order(SortParameters.Order.DESC)
				.limit(new Range(0, 9)).build();

		List<History> historys = historyRedisTemplate.boundZSetOps(key).getOperations().sort(sortQuery);

		System.out.println("!");
	}

}
