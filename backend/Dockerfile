FROM node:18-alpine

# Install build dependencies for sqlite3
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create data directory
RUN mkdir -p /app/data

EXPOSE 3001

CMD ["npm", "run", "dev"]