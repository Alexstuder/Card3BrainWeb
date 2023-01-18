FROM nginx:1.23.3

VOLUME /var/cache/nginx

## Copy our default nginx config
COPY default.conf /etc/nginx/conf.d/


RUN rm -rf /usr/share/nginx/html/*

COPY  dist/card2brainweb /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
