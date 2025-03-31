# Sử dụng image Node.js chính thức từ Docker Hub
FROM node:16

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép file package.json và package-lock.json vào thư mục làm việc
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ code vào thư mục làm việc
COPY . .

# Mở cổng mà ứng dụng Node.js sẽ lắng nghe
EXPOSE 8009

# Chạy ứng dụng Node.js
CMD ["node", "src/index.js"]