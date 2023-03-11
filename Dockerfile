FROM node:18-alpine
WORKDIR /opt/app
ENV NODE_OPTIONS="--max-old-space-size=1024"
ADD package.json package.json
RUN npm install 
ADD . .
RUN npm run build
RUN npm prune --production
CMD ["node", "./dist/main.js"]
