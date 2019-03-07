import { createImageStorageCommand } from './lib/imageStorageCommand';
import { createPdfStorageCommand } from './lib/pdfStorageCommand';

const executeCommands = async () => {
  const firstCommand = await createImageStorageCommand();
  const secondCommand = await createPdfStorageCommand();

  console.log('>> Executing first command');
  console.log('#######################################');

  // await firstCommand.execute();

  console.log('#######################################');

  console.log('>> Executing second command');
  console.log('#######################################');

  await secondCommand.execute();

  console.log('#######################################');
};

executeCommands();
