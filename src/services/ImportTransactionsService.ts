import csvParse from 'csv-parse';
import path from 'path';
import fs from 'fs';

import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';
import uploadConfig from '../config/upload';

class ImportTransactionsService {
  async execute(): Promise<Transaction[]> {
    const createTransaction = new CreateTransactionService();

    const csvFilePath = path.resolve(
      uploadConfig.directory,
      uploadConfig.filename,
    );

    const readCSVStream = fs.createReadStream(csvFilePath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const lines = [] as string[][];

    parseCSV.on('data', line => {
      lines.push(line);
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    await fs.promises.unlink(csvFilePath);

    const transactions = [] as Transaction[];

    for (let line of lines) {
      const [title, type, value, category] = line;

      const transaction = await createTransaction.execute({
        title,
        category,
        value: parseInt(value),
        type: type as 'income' | 'outcome',
      });

      transactions.push(transaction);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
