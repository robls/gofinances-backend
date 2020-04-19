import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import FindCategoryService from './FindCategoryService';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    const findCategoryService = new FindCategoryService();

    const balance = await transactionRepository.getBalance();
    const { total } = balance;

    if (type === 'outcome' && total - value < 0) {
      throw new AppError('Transaction value exceeds your balance limits', 400);
    }

    const categoryObject = await findCategoryService.execute(category);

    const transaction = transactionRepository.create({
      title,
      type,
      value,
      category: categoryObject,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
