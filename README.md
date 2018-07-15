# TEST - Book-Finder

안녕하세요. 변영감입니다.


새로운 계정을 생성하여 테스트를 진행하였습니다.


Spring MVC-Security/JPA, MariaDB, Redis, Thymeleaf, HTML, JQuery, javascript 등을 사용하여 구성하였습니다. 



# 기능
회원 가입 및 로그인 관련은 Spring-Security를 사용하였습니다.
데이터 관련된 서비스는 JPA-Mariadb를 이용하여 구성하였으며, 검색기록은 추후 확장성을 고려하여 Redis로 구성하였습니다.



# 설치내용 - 테스트 전용

* Maria-DB


https://downloads.mariadb.org/mariadb/10.3.8/
MariaDB 10.3 Series - mariadb-10.3.8-winx64.msi

1. 설치 후 "book_finder" 테이블을 생성.
2. 접근
3. 완료


* Redis


https://github.com/MicrosoftArchive/redis/releases
Redis-x64-3.2.100.msi

1. 설치 후 
2. 레디스 접속 후
redis-cli -p 6379

3. 비번 확인
127.0.0.1:6379>config get requirepass

결과 :
1) "requirepass"
2) ""
빈 값으로 보일 경우

3. 비밀번호 세팅
127.0.0.1:6379>config set requirepass foobared
OK
127.0.0.1:6379>config get requirepass
(error) NOAUTH Authentication required. 메세지가 나오면
127.0.0.1:6379>auth foobared
OK

4. 비밀번호 재확인
127.0.0.1:6379>config get requirepass

결과 :
1) "requirepass"
2) "foobared"







감사합니다.



