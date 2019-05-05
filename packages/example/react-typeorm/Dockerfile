FROM node:current
RUN cd /home/node && git clone https://github.com/apiel/isomor.git
WORKDIR /home/node/isomor/packages/example/react
RUN yarn
RUN (yarn prod 2> yarn.prod.log &) \
    && sleep 30 \
    && cat yarn.prod.log \
    && curl http://127.0.0.1:3005/ \
    && curl http://127.0.0.1:3005/isomor/status-server-getStatus/getStatus