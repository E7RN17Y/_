FROM alpine

RUN apk add --update php php-fpm composer php-fileinfo php-dom php-session php-tokenizer php-xml php-pdo_mysql  php-mysqlnd
RUN apk add --update nodejs npm 
RUN apk add --no-cache supervisor 

RUN apk update && apk add --no-cache dcron

WORKDIR /var/www/html

COPY ./src /var/www/html/

COPY supervisord.conf /etc/supervisord.conf

RUN crontab -l | { cat; echo "* * * * * php /var/www/html/artisan schedule:run >> /var/log/cron.log 2>&1"; } | crontab -

CMD ["supervisord", "-c", "/etc/supervisord.conf"]



