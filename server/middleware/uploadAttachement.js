import multer, { diskStorage } from 'multer';
import { extname } from 'path';

// Define storage settings for attachments
const storage = diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/attachments');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + extname(file.originalname));
    }
});

// Define storage settings for pictures
const storagePicture = diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/pictures');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + extname(file.originalname));
    }
});

// Create multer instances for each storage setting
const uploadAttachment = multer({ storage: storage });
const uploadPicture = multer({ storage: storagePicture });

export { uploadAttachment, uploadPicture };
