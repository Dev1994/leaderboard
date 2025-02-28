# Stage 1: Build Stage
FROM node:23.9.0-slim AS build

# Install TypeScript globally
RUN npm install -g typescript@4.8.4

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install

# Copy the rest of the application files
COPY . .

# Compile TypeScript files into JavaScript
RUN tsc

# Stage 2: Runtime Stage
FROM node:23.9.0-slim

# Set the working directory
WORKDIR /app

# Copy only the compiled output from the build stage
COPY --from=build /app/dist ./dist

# Copy the necessary runtime files (package.json, data.json, etc.)
COPY --from=build /app/package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]