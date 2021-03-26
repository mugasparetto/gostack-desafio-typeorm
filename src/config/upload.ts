import multer from 'multer';
import path from 'path';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');
const filename = 'file.csv';

export default {
  directory: tmpFolder,
  filename,
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      return callback(null, filename);
    },
  }),
};
