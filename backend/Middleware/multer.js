import multer from 'multer'

// Configure multer to store files in memory (as Buffers)
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

export { upload };

