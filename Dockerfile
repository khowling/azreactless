# Example of a multi-stage docker build process.
# First 'FROM' is the build processes running in a container
#  Copies evenything from context folder into the image, and runs a build processes
# Second 'FROM', the 1st from in thrown away except for the artifacs COPY'ed across
#  Copies only the production files, to create a smaller image
FROM node:8 as build-deps
WORKDIR /usr/src/app
# this separates the dependency installation from the edits to our actual source files. 
# This allows Docker to cache these steps so that subsequent builds
COPY package.json  ./
RUN npm install --silent
# Copy everything else from the context (except for the .dockerignore) into the image
#  and then run the build command to build the build folder (src and public)
COPY . ./
RUN npm run build


#  Stage 2 - 
FROM node:8
WORKDIR /usr/src/app
COPY --from=build-deps /usr/src/app/build ./build
COPY --from=build-deps /usr/src/app/node_modules ./node_modules
COPY lib/*.js ./lib
COPY *.js ./ 
ENV PORT 8080
EXPOSE 8080
# Create app directory
CMD ["node", "web.js"]
