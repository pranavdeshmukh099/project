import React from 'react';

const TransactionsTable = ({ transactions }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Price</th>
          <th>Date of Sale</th>
          <th>Sold</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction) => (
          <tr key={transaction._id}>
            <td>{transaction.title}</td>
            <td>{transaction.description}</td>
            <td>${transaction.price}</td>
            <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
            <td>{transaction.sold ? 'Yes' : 'No'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionsTable;
