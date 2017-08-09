FROM alpine

ADD index.js /google/
ADD package.json /google/

WORKDIR /google

RUN apk update && apk add nodejs && \
    apk add nodejs-npm && \
    adduser -h /google -u 1000 -s /bin/false -D app && \
    npm install && \
    chown -R app /google

CMD ["node", "index.js"]
