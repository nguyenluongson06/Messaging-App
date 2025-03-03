# Sử dụng Node.js phiên bản LTS
FROM node:18

WORKDIR /app

# Copy package.json và package-lock.json
COPY package.json package-lock.json ./

# Cài đặt các dependencies
RUN npm install

# Copy toàn bộ mã nguồn vào container
COPY . .

# Mở cổng cho server backend
EXPOSE 5000

# Chạy ứng dụng
CMD ["npm", "start"]
