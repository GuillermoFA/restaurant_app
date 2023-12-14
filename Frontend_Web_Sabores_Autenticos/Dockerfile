FROM node:18-alpine as node

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm run build --prod

FROM nginx:1.25.2-alpine
COPY nginx.conf /etc/nginx/conf.d/
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=node /usr/src/app/dist/front-end-proyecto /usr/share/nginx/html
EXPOSE 80
