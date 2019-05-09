FROM node:10.15.3-alpine

RUN apk add --no-cache tini git

ARG APP_DIR

RUN mkdir -p ${APP_DIR}/build && \
    mkdir -p ${APP_DIR}/node_modules && \
    mkdir -p /home/node/.cache/yarn && \
    chown node:node -R ${APP_DIR} /home/node

USER node

ENTRYPOINT ["/sbin/tini", "--"]
