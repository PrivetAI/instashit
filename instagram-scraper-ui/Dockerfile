FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production --silent 2>/dev/null || npm install --silent

# Copy all files
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]