# Stage 1: Build the Next.js app
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Next.js app
RUN npm run build

# Stage 2: Serve the Next.js app
FROM node:20-alpine AS runner

# Set the working directory
WORKDIR /app

# Copy the build output from the builder stage
COPY --from=builder /app/ .

# Expose the port Next.js runs on
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "run", "start"]
