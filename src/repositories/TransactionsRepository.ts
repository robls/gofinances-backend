import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionsRepository = getRepository(Transaction);
    const transactions = await transactionsRepository.find();
    const balance: Balance = { income: 0, outcome: 0, total: 0 };

    balance.total = transactions.reduce((acc, transaction) => {
      if (transaction.type === 'income') {
        balance.income += transaction.value;
        return acc + transaction.value;
      }
      balance.outcome += transaction.value;
      return acc - transaction.value;
    }, 0);

    return balance;
  }
}

export default TransactionsRepository;
