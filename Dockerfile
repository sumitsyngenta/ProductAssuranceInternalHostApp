FROM node:20-alpine

# Install system packages
RUN apk add --no-cache python3 make g++ bash git

WORKDIR /usr/src/app

# Copy package files (we rely on host-installed node_modules for local dev)
COPY package.json yarn.lock ./

# Copy app sources
COPY . .

# Set Metro host to host.docker.internal by default
ENV REACT_NATIVE_PACKAGER_HOSTNAME=host.docker.internal

EXPOSE 8081

CMD ["yarn", "start", "--host", "0.0.0.0", "--port", "8081"]
