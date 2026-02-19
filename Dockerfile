# Use a base Node.js image
FROM node:22.12.0-bullseye

COPY ./Zscaler_Root_CA.pem /usr/local/share/ca-certificates/zscaler.crt
RUN update-ca-certificates

WORKDIR /app

COPY package*.json ./

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm ci

COPY . .

ARG PAGEFIND_VERSION=1.4.0
ARG PAGEFIND_FLAVOR=extended   # "bin" or "extended"
ARG PAGEFIND_TARGET=x86_64-unknown-linux-musl

RUN set -eux; \
    install -d -m 0755 /opt/pagefind; \
    cd /opt/pagefind; \
    # pick archive base name based on flavor
    if [ "${PAGEFIND_FLAVOR}" = "extended" ]; then \
      BASENAME="pagefind_extended-v${PAGEFIND_VERSION}-${PAGEFIND_TARGET}"; \
      BINNAME="pagefind_extended"; \
    else \
      BASENAME="pagefind-v${PAGEFIND_VERSION}-${PAGEFIND_TARGET}"; \
      BINNAME="pagefind"; \
    fi; \
    TARBALL="${BASENAME}.tar.gz"; \
    URL="https://github.com/Pagefind/pagefind/releases/download/v${PAGEFIND_VERSION}/${TARBALL}"; \
    echo "Fetching ${URL}"; \
    curl -fsSL -o "${TARBALL}" "${URL}"; \
    tar -xzf "${TARBALL}"; \
    rm -f "${TARBALL}"; \
    # sanity: ensure expected binary exists after extraction
    ls -l "${BINNAME}"; \
    install -m 0755 "${BINNAME}" "/usr/local/bin/${BINNAME}"; \
    # Optional: for convenience, map `pagefind` to extended if chosen
    if [ "${PAGEFIND_FLAVOR}" = "extended" ]; then ln -sf "/usr/local/bin/${BINNAME}" /usr/local/bin/pagefind; fi; \
    # final sanity checks
    (pagefind --help || true) >/dev/null 2>&1; \
    (pagefind_extended --help || true) >/dev/null 2>&1

EXPOSE 4561

ENV PORT 4561

CMD ["npm", "run", "dev", "--", "--port", "4561", "--host", "0.0.0.0"]
