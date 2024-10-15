# Step 1: Build the Angular application
FROM node:22 AS build

# Set the working directory
WORKDIR /app

# Copy the rest of the application code
COPY . .

RUN npm install

RUN npm run build --prod

# Step 2: Serve the application with Nginx
FROM nginx

#### copy nginx conf
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the built files from the previous stage
COPY --from=build /app/dist/course-dashboard/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
