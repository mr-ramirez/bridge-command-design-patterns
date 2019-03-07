import path from 'path';

import { createStorage } from './storage';

const createImageStorageCommand = async () => {
  const storage = await createStorage({
    platform: 'GD',
    options: { mimeType: 'image/png' },
  });

  const paths = [
    path.normalize(`${__dirname}/../images/upload1.png`),
    path.normalize(`${__dirname}/../images/upload2.png`),
    path.normalize(`${__dirname}/../images/upload3.png`),
  ];

  return {
    async execute() {
      const uploadPromises = [
        storage.upload({ fileName: 'upload1', path: paths[0] }),
        storage.upload({ fileName: 'upload2', path: paths[1] }),
        storage.upload({ fileName: 'upload2', path: paths[1] }),
      ];
      await Promise.all(uploadPromises);

      await storage.listFiles();
    },
  };
};

export { createImageStorageCommand };
