FROM nginx:alpine
COPY . /usr/share/nginx/html
# in production the frontend proxies /api/* via nginx, so apiBase is empty
RUN echo '{"apiBase":""}' > /usr/share/nginx/html/config.json
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
