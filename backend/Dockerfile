FROM node:8.11.3

WORKDIR /usr/src/app

RUN printf '%s\n' \
    'deb http://archive.debian.org/debian jessie main' \
    'deb-src http://archive.debian.org/debian jessie main' \
    > /etc/apt/sources.list \
    && apt-get -o Acquire::Check-Valid-Until=false -o Acquire::AllowInsecureRepositories=true update \
    && apt-get install -y --allow-unauthenticated --no-install-recommends \
    python \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

ENV PYTHON=/usr/bin/python

COPY package.json package-lock.json /usr/src/app/
RUN npm install --unsafe-perm

COPY . /usr/src/app

EXPOSE 3000
CMD ["npm", "start"]
