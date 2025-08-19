FROM node:22-alpine

LABEL maintainer="ansh1990@gmail.com"
LABEL version="0.1.0"
LABEL description="website.anshdavid @astro paper theme"

RUN corepack enable pnpm
EXPOSE 4321

WORKDIR /app

CMD ["tail", "-f", "/dev/null"]