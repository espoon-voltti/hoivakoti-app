FROM node:12-alpine

# Create app directory
WORKDIR /usr/app

# Install app dependencies
COPY package.json yarn.lock ./

RUN yarn install --production
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 4001

CMD ["npm", "run", "start"]
