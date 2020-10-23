FROM node:lts

WORKDIR /sunhammer

COPY package.json ./

RUN yarn

EXPOSE 6006

# Run start command
CMD ["yarn", "storybook"]