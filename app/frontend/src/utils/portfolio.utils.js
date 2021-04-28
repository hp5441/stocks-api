export const fetchUserPortfolio = async () => {
  const portfolio = await fetch("/api/stock/portfolio/").then((res) =>
    res.json()
  );
  const processedPortfolio = {};
  await portfolio.forEach(({ pk, ...otherItems }) => {
    processedPortfolio[`${pk}`] = { ...otherItems };
  });
  return processedPortfolio;
};

export const addTransaction = async ({ csrftoken, ...transactionDetails }) => {
  const transaction = await fetch("/api/stock/transactionsdetail/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify(transactionDetails),
  }).then((res) => res.json());
  return transaction;
};

export const updateTransaction = async ({
  csrftoken,
  ...transactionDetails
}) => {
  const transaction = await fetch("/api/stock/transactionsdetail/", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify(transactionDetails),
  }).then((res) => res.json());
  return transaction;
};

export const deleteTransaction = async ({
  csrftoken,
  ...transactionDetails
}) => {
  const statusCode = await fetch("/api/stock/transactionsdetail/", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify(transactionDetails),
  });
  return statusCode;
};

export const deletePortfolioStock = async ({
  csrftoken,
  ...portfolioStockDetails
}) => {
  const statusCode = await fetch("/api/stock/portfoliostockdelete/", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify(portfolioStockDetails),
  });
  return statusCode;
};

export const fetchTransactions = async (portfolio_id) => {
  const transactions = await fetch(
    `/api/stock/transactions/?p_id=${portfolio_id}`
  ).then((res) => res.json());
  const processedTransactions = {};
  await transactions.forEach(({ portfolio, stock, ...otherItems }) => {
    const pstock_id = portfolio.toString() + "_" + stock;
    if (pstock_id in processedTransactions) {
      const prevElem =
        processedTransactions[pstock_id][
          processedTransactions[pstock_id].length - 1
        ];
      if (otherItems.transaction_type === "B") {
        otherItems.totalQuantity = prevElem.totalQuantity + otherItems.quantity;
      } else {
        otherItems.totalQuantity = prevElem.totalQuantity - otherItems.quantity;
      }
      processedTransactions[pstock_id].push({
        ...otherItems,
        stock: stock,
        portfolio: portfolio,
      });
    } else {
      processedTransactions[pstock_id] = [
        {
          ...otherItems,
          stock: stock,
          portfolio: portfolio,
          totalQuantity: otherItems.quantity,
        },
      ];
    }
  });
  return processedTransactions;
};

export const filterOpenTransactions = (transactions) => {
  const openDict = {};
  const closedDict = {};
  if (transactions) {
    Object.keys(transactions).forEach((pstock_id) => {
      const tempList = [];
      const soldPositions = transactions[pstock_id].filter(
        ({ transaction_type }) => transaction_type === "S"
      );
      const boughtPositions = transactions[pstock_id].filter(
        ({ transaction_type }) => transaction_type === "B"
      );
      soldPositions.forEach((transaction) => {
        let soldQuantity = transaction.quantity;
        while (soldQuantity > 0) {
          if (boughtPositions[0].quantity <= soldQuantity) {
            tempList.push(boughtPositions.shift());
            soldQuantity -= tempList[tempList.length - 1].quantity;
          } else {
            const boughtTemp = boughtPositions.shift();
            tempList.push({ ...boughtTemp, quantity: soldQuantity });
            boughtPositions.unshift({
              ...boughtTemp,
              quantity: boughtTemp.quantity - soldQuantity,
            });
            //console.log(boughtTemp, soldQuantity, "from utils");
            soldQuantity = 0;
          }
        }
        tempList.push(transaction);
      });
      closedDict[pstock_id] = tempList;
      openDict[pstock_id] = boughtPositions;
    });
  }
  return [openDict, closedDict];
};

export const fetchNews = async (stocks, csrftoken) => {
  console.log({ stocks });
  const news = await fetch("/api/stock/stocknewsrange/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify({ stocks: stocks }),
  }).then((res) => res.json());

  return news;
};
