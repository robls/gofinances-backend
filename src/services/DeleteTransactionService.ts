import { getCustomRepository } from 'typeorm';
import { isUuid } from 'uuidv4';

import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    if (!isUuid(id)) {
      throw new AppError('Please insert a valid id', 401);
    }

    const transaction = await transactionsRepository.findOne({ where: { id } });

    if (!transaction) {
      throw new AppError('Please insert an existing id', 401);
    }

    await transactionsRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
