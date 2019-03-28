#使用nodejs
FROM finfosoft/nodejs8-alpine-httpserver

#维护者信息
MAINTAINER niuzhifa "1944044667@qq.com"

ADD dist /home/app/webapps/dist

WORKDIR /home/app/webapps/dist

EXPOSE 8080

CMD ["hs"]