# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose the port your app runs on
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
