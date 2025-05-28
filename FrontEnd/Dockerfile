FROM node:20

RUN npm install -g @angular/cli --quiet && \
    ng analytics disable --global

WORKDIR /app

COPY package*.json ./
RUN npm install --quiet

COPY . .

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0", "--disable-host-check", "--poll=1000"]