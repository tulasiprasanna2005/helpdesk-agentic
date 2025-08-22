# --- Stage 1: Build the React application ---
FROM node:20 as build

WORKDIR /app

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the source code
COPY . .

# Build the app for production
RUN npm run build

# --- Stage 2: Serve the production build with a web server ---
FROM nginx:alpine

# Copy the built files from the previous stage to the Nginx web root
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the port Nginx will serve from
EXPOSE 80

# The default Nginx command will run automatically
CMD ["nginx", "-g", "daemon off;"]