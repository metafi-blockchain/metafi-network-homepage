# Use the official Nginx base image
FROM nginx:stable-alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Copy website source code into the container
COPY ./website .

# Expose HTTP port
EXPOSE 80

# Start nginx in foreground mode
CMD ["nginx", "-g", "daemon off;"]