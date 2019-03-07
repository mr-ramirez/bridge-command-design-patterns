import { google } from 'googleapis';
import fs from 'fs';

const createGoogleDriveStorage = async ({ mimeType }) => {
  const auth = await google.auth.getClient({
    scopes: [
      'https://www.googleapis.com/auth/drive',
    ],
  });

  const drive = google.drive({
    version: 'v3',
    auth,
  });

  const platform = 'Google Drive';

  return {
    drive,
    mimeType,
    platform,
    async download({ fileName, path }) {
      try {
        console.log(`>> ${platform}: Download initiated`);
  
        const destination = fs.createWriteStream(path);
        drive.files.get(
          {
            fileId,
            alt: 'media',
          },
          { responseType: 'stream' },
          (error, response) => {
            response.data
              .on('end', () => {
                  console.log(`>> ${platform}: Download finished`);
              })
              .on('error', error => {
                  console.log(`>> ${platform}: Download failed: `, error);
              })
              .pipe(destination);
          }
        );
      } catch (error) {
        console.log(`>> ${platform}: Download failed: `, error);
      }
    },
    async listFiles() {
      try {
        console.log(`>> ${platform}: Listing files initiated`);

        const response = await drive.files.list({
          pageSize: 50,
          fields: 'nextPageToken, files(id, name)',
        });

        console.log(`>> ${platform}: Listing files finished`);
        console.log(`>> ${platform}: Listing files results:`);
        console.log('----------------------------------------------');
        
        response.data.files.forEach(item => {
          const { id, name } = item;

          console.log(`>>>> ID: ${id}`);
          console.log(`>>>> File name: ${name}`);
          console.log('----------------------------------------------');
        });
      } catch (error) {
        console.log(`>> ${platform}: Listing files failed: `, error);
      }
    },
    async upload({ fileName, path }) {
      try {
        console.log(`>> ${platform}: Upload initiated`);

        await drive.files.create({
          requestBody: {
            name: fileName,
            mimeType,
          },
          media: {
            mimeType,
            body: fs.createReadStream(path)
          }
        });

        console.log(`>> ${platform}: Upload finished`);
      } catch(error) {
        console.log(`>> ${platform}: Upload failed: `, error);
      }
    },
  };
};

export { createGoogleDriveStorage };
