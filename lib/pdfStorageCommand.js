import path from 'path';

import { createStorage } from './storage';

const createPdfStorageCommand = () => {
  const storage = createStorage({
    platform: 'S3',
  });

  const paths = [
    path.normalize(`${__dirname}/../documents/upload1.pdf`),
  ];

  return {
    async execute() {
      const uploadPromises = [
        storage.upload({ fileName: 'upload1', path: paths[0] }),
      ];

      await Promise.all(uploadPromises);

      await storage.listFiles();
    },
  };
};

export { createPdfStorageCommand };
