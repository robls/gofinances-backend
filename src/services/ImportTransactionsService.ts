import fs from 'fs';
import neatCsv from 'neat-csv';

import Transaction from '../models/Transaction';
import uploadConfig from '../config/upload';
import CreateTransactionService from './CreateTransactionService';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class ImportTransactionsService {
  async execute(filename: string): Promise<Transaction[]> {
    const csv = fs.readFileSync(`${uploadConfig.directory}/${filename}`);
    const createTransactionService = new CreateTransactionService();

    async function readCSV(content) {
      const result = await neatCsv(content, {
        mapHeaders: ({ header }) => header.trim(),
        mapValues: ({ value }) => value.trim(),
      });
      return result;
    }

    const neatResults = await readCSV(csv);
    const results: Transaction[] = [];

    // return results;
  }
}

export default ImportTransactionsService;
