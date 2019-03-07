import { createAwsS3Storage } from './AWS-S3';
import { createGoogleDriveStorage } from './GoogleDrive';

const createStorage = ({ platform, options }) => {
  switch(platform) {
    case 'GD':
      return createGoogleDriveStorage({ mimeType: options.mimeType });
    case 'S3':
      return createAwsS3Storage();
    default:
      console.error('>> Unsupported platform');
  }
};

export { createStorage };
