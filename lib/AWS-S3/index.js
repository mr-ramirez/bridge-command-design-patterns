import AwsS3 from 'aws-sdk/clients/s3';
import fs from 'fs';

import { config } from './config.js';

const createAwsS3Storage = () => {
  const { keyId, secretAccessKey } = config;

  const s3 = new AwsS3({
    signatureVersion: 'v4',
    accessKeyId: keyId,
    secretAccessKey: secretAccessKey,
    region: 'us-east-1',
  });

  const platform = 'AWS S3';

  return {
    platform,
    s3,
    async download({ fileName, path }) {
      const { bucketName } = config;

      const parameters = {
        Bucket: bucketName,
        Key: fileName,
      };

      try {
        console.log(`>> ${platform}: Download initiated`);
        const response = await s3.getObject(parameters).promise();
        await fs.writeFileSync(path, response.Body.toString('utf8'));
        console.log(`>> ${platform}: Download finished`);
      } catch(error) {
        console.log(`>> ${platform}: Download failed: `, error);
      }
    },
    async listFiles() {
      const { bucketName } = config;

      const parameters = {
        Bucket: bucketName,
        MaxKeys: 50,
      };

      try {
        console.log(`>> ${platform}: Listing files initiated`);

        const response = await s3.listObjects(parameters).promise();

        console.log(`>> ${platform}: Listing files finished`);
        console.log(`>> ${platform}: Listing files results:`);
        console.log('----------------------------------------------');

        response.Contents.forEach(item => {
          const { ETag, Key, LastModified, Size } = item;

          console.log(`>>>> ETAG: ${ETag}`);
          console.log(`>>>> File name: ${Key}`);
          console.log(`>>>> Last date modified: ${LastModified}`);
          console.log(`>>>> Size (Bytes): ${Size}`);
          console.log('----------------------------------------------');
        });
      } catch(error) {
        console.log(`>> ${platform}: Listing files failed: `, error);
      }
    },
    async upload({ fileName, path }) {
      const { bucketName } = config;

      const parameters = {
        Bucket: bucketName,
        Key: fileName,
        Body: fs.createReadStream(`${path}`),
      };

      try {
        console.log(`>> ${platform}: Upload initiated`);
        await s3.putObject(parameters).promise();
        console.log(`>> ${platform}: Upload finished`);
      } catch(error) {
        console.log(`>> ${platform}: Upload failed: `, error);
      }
    },
  };
};

export { createAwsS3Storage };
