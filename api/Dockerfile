FROM node:22-alpine3.21@sha256:f2dc6eea95f787e25f173ba9904c9d0647ab2506178c7b5b7c5a3d02bc4af145

# ENV NODE_ENV production

WORKDIR /app

COPY sa-key.json ./sa-key.json
COPY . .

RUN npm ci

# EXPOSE 3001
EXPOSE 8080

USER node

CMD ["npm", "--no-update-notifier", "start"]