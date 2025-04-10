import * as multer from 'multer';
import { Options as MulterOptions } from 'multer';

// Định nghĩa cấu hình Multer
export const multerOptions: MulterOptions = {
  storage: multer.diskStorage({
    destination: './uploads', // Thư mục lưu trữ file tải lên
    filename: (req, file, cb) => {
      // Tạo tên file duy nhất với thời gian hiện tại
      const filename = `${Date.now()}-${file.originalname}`;
      cb(null, filename); // Gửi tên file duy nhất cho Multer
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn kích thước file 5MB
  fileFilter: (req, file, cb) => {
    // Kiểm tra định dạng file (jpg, jpeg, png, gif)
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      cb(null, true); // Cho phép tải lên
    } else {
      // Từ chối nếu không phải hình ảnh
      cb(null, false); // Từ chối tệp này
    }
  },
};
