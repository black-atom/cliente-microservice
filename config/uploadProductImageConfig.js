const getConfig = require('./index');

const config = getConfig({
    development: {
      keyFilename: process.env.STORAGE_KEY_FILE_NAME || "./credentials/google.json",
      projectId: process.env.STORAGE_PROJECT_ID || "blackatom-projects",
      bucket: process.env.STORAGE_BUCKET || 'blackatom-test-storage',
      directoryName: process.env.STORAGE_DIRECTORY_NAME || 'products',
      acl: process.env.ACL || 'publicRead'
    },

    test: {
      keyFilename: process.env.STORAGE_KEY_FILE_NAME || "./credentials/google.json",
      projectId: process.env.STORAGE_PROJECT_ID || "blackatom-projects",
      bucket: process.env.STORAGE_BUCKET || 'blackatom-test-storage',
      directoryName: process.env.STORAGE_DIRECTORY_NAME || 'products',
      acl: process.env.ACL || 'publicRead',
    },

    production: {
      keyFilename: process.env.STORAGE_KEY_FILE_NAME || "./credentials/google.json",
      projectId: process.env.STORAGE_PROJECT_ID || "blackatom-projects",
      bucket: process.env.STORAGE_BUCKET || 'blackatom-images',
      directoryName: process.env.STORAGE_DIRECTORY_NAME || 'products',
      acl: process.env.ACL || 'publicRead',
    }
});

module.exports = config;