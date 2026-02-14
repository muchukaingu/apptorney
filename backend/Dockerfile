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
    curl \
    ca-certificates \
    bzip2 \
    && rm -rf /var/lib/apt/lists/*

# Keep Python 2 for legacy node-gyp builds, add Python 3 for embedding scripts.
RUN set -eux; \
    arch="$(uname -m)"; \
    if [ "$arch" = "aarch64" ]; then \
      conda_url="https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-aarch64.sh"; \
    else \
      conda_url="https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-x86_64.sh"; \
    fi; \
    curl -fsSL "$conda_url" -o /tmp/miniforge.sh; \
    bash /tmp/miniforge.sh -b -p /opt/conda; \
    rm -f /tmp/miniforge.sh; \
    /opt/conda/bin/conda install -y python=3.10 pip; \
    /opt/conda/bin/python -m pip install --no-cache-dir --upgrade pip

ENV PYTHON=/usr/bin/python
ENV EMBEDDING_PYTHON_BIN=/opt/conda/bin/python
ENV EMBEDDING_QUERY_SCRIPT=/usr/src/app/scripts/embed_text.py

COPY package.json package-lock.json /usr/src/app/
RUN npm install --unsafe-perm

COPY . /usr/src/app
RUN /opt/conda/bin/python -m pip install --no-cache-dir -r /usr/src/app/scripts/requirements-embeddings.txt

EXPOSE 3000
CMD ["npm", "start"]
