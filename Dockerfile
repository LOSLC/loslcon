FROM node:25

RUN useradd -m app
USER app
WORKDIR /home/app/app

COPY --chown=app:app . .

RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
