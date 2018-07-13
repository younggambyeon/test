package com.younggambyeon.test.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class CommonUtil {

	public static String getCurrentDate(String pattern) {
		Date dt = new Date();
		// "yyyy-MM-dd a hh:mm"
		SimpleDateFormat sdf = new SimpleDateFormat(pattern);
		return sdf.format(dt).toString();
	}

	public static Date getDateByStringDateAndPattern(String StringDate, String pasttern) throws ParseException {
		SimpleDateFormat format = new SimpleDateFormat(pasttern);
		Date date = format.parse(StringDate);

		return date;
	}

	public static String convertLongtoDateString(long time) {
		Date date = new Date(time);
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

		return format.format(date);
	}

	public static int getViewPageNumber(int size, int total) {
		int viewPageNumber = (total / size);
		boolean modFlag = (total % size) == 0 ? true : false;
		viewPageNumber = modFlag ? viewPageNumber : viewPageNumber + 1;

		return viewPageNumber;
	}

	public static String extractBookIsbn(String isbn) {
		// 카카오 API => isbn 처음에 공백이 들어간 결과들이 있음.
		String str = isbn.substring(0, 1);
		if (" ".equals(str)) {
			return isbn.trim();
		}

		// 카카오 API => "isbn" 예("898078290X 9788980782901") 'x'포함된 isbn은 결과 없음.
		if (isbn.contains(" ")) {
			String[] array = isbn.split(" ");

			for (String s : array) {
				if (!s.contains("X")) {
					isbn = s;
				}
			}
		}

		return isbn;
	}

}
