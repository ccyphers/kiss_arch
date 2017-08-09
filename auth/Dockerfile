FROM alpine

ADD index.js /auth/
ADD migrations /auth/migrations
ADD seeds /auth/seeds
ADD knexfile.js /auth/
ADD lib /auth/lib
ADD models /auth/models
ADD package.json /auth/
ADD npm-shrinkwrap.json /auth

WORKDIR /auth

RUN apk update && apk add nodejs && \
    apk add python && \
    apk add build-base && \
    apk add postgresql-dev && \
    apk add nodejs-npm && \
    apk add git && \
    apk add libpq && \
    adduser -h /auth -u 1000 -s /bin/false -D app && \
    npm install && \
    npm rebuild bcrypt --build-from-source && \
    apk del python && \
    apk del build-base && \
    apk del git && \
    apk del postgresql-dev && \
    chown -R app /auth

CMD ["node", "index.js"]
