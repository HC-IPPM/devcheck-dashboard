FROM node:22-alpine3.21@sha256:f2dc6eea95f787e25f173ba9904c9d0647ab2506178c7b5b7c5a3d02bc4af145

# ENV NODE_ENV production

WORKDIR /app
COPY public/locales /app/public/locales
COPY i18n/locales /app/i18n/locales 

COPY .env .env
COPY . .

# Set ownership of the /app directory to the 'node' user
RUN chown -R node:node /app
RUN npm ci

RUN npm run build

RUN chmod -R 777 /app/node_modules/.vite*

EXPOSE 8080

USER node

CMD ["npm", "--no-update-notifier", "run", "dev", "--port", "8080"]
# CMD ["npm", "run", "preview", "--", "--port", "8080"]
# CMD ["npm", "run", "preview", "--", "--port", "8080", "--host"]