# VibeConnect

VibeConnect là một dự án mạng xã hội nhỏ, gồm frontend React/Vite và backend Express/MongoDB. Ứng dụng hỗ trợ đăng ký, đăng nhập, xem bảng tin, tạo bài viết, xoá bài viết, thích bài viết và cập nhật lượt thích theo thời gian thực bằng Socket.IO.

## Tính năng chính

- Đăng ký, đăng nhập và lưu phiên đăng nhập bằng JWT.
- Bảo vệ route frontend, tự chuyển hướng khi chưa đăng nhập.
- Tạo bài viết dạng text hoặc kèm media.
- Upload ảnh/video bài viết lên Cloudinary.
- Xem danh sách bài viết có phân trang ở API.
- Like/unlike bài viết.
- Realtime cập nhật lượt like qua Socket.IO.
- Validate dữ liệu request bằng Zod.
- Xử lý lỗi tập trung ở backend.

## Công nghệ sử dụng

**Frontend**

- React 19
- Vite
- React Router
- Socket.IO Client
- ESLint

**Backend**

- Node.js
- Express 5
- MongoDB + Mongoose
- JWT
- bcrypt
- Multer
- Cloudinary
- Socket.IO
- Zod

## Cấu trúc thư mục

```text
vibeconnect/
├── backend/
│   ├── server.js
│   └── src/
│       ├── app.js
│       ├── config/
│       ├── middlewares/
│       ├── modules/
│       │   ├── auth/
│       │   ├── comments/
│       │   ├── like/
│       │   ├── posts/
│       │   └── users/
│       ├── utils/
│       └── validation/
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── services/
│   └── vite.config.js
├── package.json
└── README.md
```

## Yêu cầu trước khi chạy

Cài sẵn:

- Node.js
- npm
- MongoDB local hoặc MongoDB Atlas
- Tài khoản Cloudinary nếu muốn đăng bài có ảnh/video

## Cài đặt

Clone project và cài dependency:

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

## Cấu hình biến môi trường

Tạo file `backend/.env`:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/vibeconnect
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_POST_FOLDER=vibeconnect/posts
```

Tạo file `frontend/.env` nếu muốn cấu hình rõ API URL:

```env
VITE_API_URL=http://localhost:5000
```

Nếu không có `VITE_API_URL`, frontend mặc định gọi API tại `http://localhost:5000`.

## Chạy project ở môi trường development

Chạy cả backend và frontend cùng lúc từ thư mục gốc:

```bash
npm run server
```

Hoặc chạy riêng từng phần:

```bash
npm run server:backend
npm run server:frontend
```

Mặc định:

- Backend chạy tại `http://localhost:5000`
- Frontend chạy tại `http://localhost:5173`

Mở trình duyệt tại:

```text
http://localhost:5173
```

## Build frontend

```bash
npm run build --prefix frontend
```

Xem thử bản build:

```bash
npm run preview --prefix frontend
```

## Kiểm tra lint frontend

```bash
npm run lint --prefix frontend
```

## Luồng sử dụng cơ bản

1. Truy cập `http://localhost:5173`.
2. Đăng ký tài khoản mới tại `/register`.
3. Đăng nhập tại `/login`.
4. Sau khi đăng nhập thành công, ứng dụng chuyển vào `/home`.
5. Tạo bài viết mới ở ô composer.
6. Có thể đính kèm ảnh/video khi đăng bài.
7. Like/unlike bài viết trên feed.
8. Xoá bài viết của bạn nếu cần.

## API chính

Base URL mặc định:

```text
http://localhost:5000
```

### Auth

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| `POST` | `/auth/register` | Đăng ký tài khoản |
| `POST` | `/auth/login` | Đăng nhập |
| `GET` | `/auth/me` | Lấy thông tin user hiện tại |

### Posts

Các endpoint posts yêu cầu header:

```http
Authorization: Bearer <token>
```

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| `POST` | `/posts` | Tạo bài viết |
| `GET` | `/posts?page=1&limit=20` | Lấy danh sách bài viết |
| `GET` | `/posts/:id` | Lấy chi tiết bài viết |
| `PUT` | `/posts/:id` | Cập nhật bài viết |
| `DELETE` | `/posts/:id` | Xoá bài viết |

Khi tạo bài viết có media, gửi request dạng `multipart/form-data`:

- `content`: nội dung bài viết
- `media`: file ảnh/video, tối đa 4 file

Mỗi file media tối đa 50MB.

### Likes

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| `POST` | `/likes` | Like bài viết |
| `GET` | `/likes/post/:postId` | Lấy danh sách like của bài viết |
| `DELETE` | `/likes/:id` | Bỏ like |

Body mẫu khi like bài viết:

```json
{
  "postID": "post_id_here"
}
```

### Comments

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| `POST` | `/comments` | Tạo bình luận |
| `GET` | `/comments/post/:postId` | Lấy bình luận theo bài viết |
| `PUT` | `/comments/:id` | Cập nhật bình luận |
| `DELETE` | `/comments/:id` | Xoá bình luận |

## Ghi chú phát triển

- Backend đọc biến môi trường từ `backend/.env`.
- Frontend gọi API thông qua `frontend/src/services/api.js`.
- Token đăng nhập được gắn vào header `Authorization`.
- Socket.IO dùng chung URL với backend API.
- Nếu frontend không gọi được backend, kiểm tra `CLIENT_URL` trong `backend/.env` và `VITE_API_URL` trong `frontend/.env`.
- Nếu upload media lỗi, kiểm tra cấu hình Cloudinary và dung lượng/định dạng file.

## Lỗi thường gặp

**MongoDB connection error**

Kiểm tra `MONGO_URI` và đảm bảo MongoDB đang chạy hoặc connection string MongoDB Atlas chính xác.

**CORS error**

Kiểm tra:

```env
CLIENT_URL=http://localhost:5173
```

Giá trị này phải trùng origin của frontend.

**Unauthorized hoặc tự quay về trang login**

Token có thể thiếu, sai hoặc hết hạn. Hãy đăng nhập lại.

**Media file must be 50MB or smaller**

File upload vượt quá giới hạn 50MB.

## Tác giả

Dự án được xây dựng cho mục đích học tập và thực hành phát triển website full-stack.
