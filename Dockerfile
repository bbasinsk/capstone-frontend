FROM node:alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app
RUN npm run build
EXPOSE 3000

# Start spp
ENV NODE_ENV production
CMD [ "node", "--optimize_for_size", "--max_old_space_size=460", "server.js" ]
