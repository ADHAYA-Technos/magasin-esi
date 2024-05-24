import multer, { diskStorage } from 'multer';
import { extname } from 'path';

// Define storage settings for multer to use
const storage = diskStorage({
	// Set destination folder for uploaded files
	destination: function (req, file, cb) {
		cb(null, './uploads/attachments');
	},
	// Rename uploaded files to have a unique name with original extension
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now() + extname(file.originalname));
	}
});

// Initialize multer with defined storage settings
// Initialize upload
const upload = multer({
    storage: storage
  });  

export default upload;
  