ARG BASE_IMAGE_VERSION=latest

FROM 307238562370.dkr.ecr.eu-west-1.amazonaws.com/voltti/node:${BASE_IMAGE_VERSION}

# Create app directory
ENV USERNAME voltti
ENV HOME_DIR /home/${USERNAME}
ENV NODE_ENV production

USER root

RUN set -eux \
    && apt-get update && apt-get install -y --no-install-recommends --no-install-suggests \
      wget \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

USER ${USERNAME}
WORKDIR ${HOME_DIR}

# Install app dependencies
COPY --chown=1000 package.json yarn.lock ./
RUN yarn install --prod --frozen-lockfile \
    && yarn cache clean
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY --chown=1000 . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
