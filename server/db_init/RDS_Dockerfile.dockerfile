FROM mysql:8.0

ENV MYSQL_DATABASE=ecoyah_db \
    MYSQL_ROOT_PASSWORD=Kunyah!

ADD db_init.sql /docker-entrypoint-initdb.d

EXPOSE 3306