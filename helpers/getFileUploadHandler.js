const multer = require('multer');
const uuid = require('uuid');
const MulterGoogleCloudStorage = require('multer-google-storage');
const {
  pipe,
  prop,
  applySpec,
  defaultTo,
} = require('ramda')

const getFileNameToStore = directoryName => (req, file, cb) => {
	cb(null,`${directoryName}/${uuid()}_${file.originalname}`);
}

const getUploadHandler = config => {
  const storageConfig = applySpec({
    keyFilename: prop('keyFilename'),
    projectId: prop('projectId'),
    bucket: prop('bucket'),
    maxRetries: defaultTo(3),
    filename: pipe(prop('directoryName'), getFileNameToStore),
    acl: prop('acl'),
  })

  return multer({
    storage: MulterGoogleCloudStorage.storageEngine(storageConfig(config)),
  }).single("file");
}

module.exports = getUploadHandler;