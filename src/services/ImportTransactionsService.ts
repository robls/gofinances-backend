import fs from 'fs';
import parse from 'csv-parse';

import Transaction from '../models/Transaction';
import uploadConfig from '../config/upload';
import CreateTransactionService from './CreateTransactionService';

class ImportTransactionsService {
  public async execute(filename: string): Promise<Transaction[]> {
    const createTransactionService = new CreateTransactionService();
    const results: Transaction[] = [];
    const filepath = `${uploadConfig.directory}/${filename}`;
    const output = [];

    const fileStream = fs
      .createReadStream(filepath)
      .pipe(parse({ delimiter: ', ' }));

    for await (const data of fileStream) {
      output.push(data);
    }

    delete output[0];

    for await (const row of output) {
      if (row) {
        const [title, type, value, category] = row;
        const parsedValue = parseFloat(value);
        const transaction = await createTransactionService.execute({
          title,
          type,
          value: parsedValue,
          category,
        });
        results.push(transaction);
      }
    }

    fs.unlink(filepath, function error(err) {
      if (err) throw err;
    });

    return results;
  }
}

export default ImportTransactionsService;
