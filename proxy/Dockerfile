FROM nginx:1.19-alpine

WORKDIR /etc/nginx/conf.d

COPY ./nginx.conf .

RUN mv nginx.conf default.conf

CMD ["-g", "daemon off;"]
