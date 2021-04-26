export const fetchStockList = async () => {
  const stocks = await fetch("/api/stock/stocks/").then((res) => res.json());
  return stocks;
};

export const fetchUserWatchlists = async () => {
  const watchlists = await fetch("/api/stock/watchlist/").then((res) =>
    res.json()
  );
  const processedWatchlists = {};
  await watchlists.forEach(({ pk, ...otherItems }) => {
    processedWatchlists[`${pk}`] = { ...otherItems };
  });
  return processedWatchlists;
};

export const addStockToUserWatchlist = async ({
  watchlist,
  csrftoken,
  ...body
}) => {
  const stock = await fetch(`/api/stock/watchliststock/${watchlist}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify(body),
  }).then((res) => res.json());
  return stock;
};

export const deleteStockFromUserWatchlist = async ({
  watchlist,
  csrftoken,
  ...body
}) => {
  const statusCode = await fetch(`/api/stock/watchliststock/${watchlist}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify(body),
  }).then((res) => res.status);
  return statusCode;
};

export const deleteUserWatchlist = async ({ csrftoken, ...details }) => {
  const statusCode = await fetch(`/api/stock/watchlistdetail/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify(details),
  }).then((res) => res.status);
  return statusCode;
};

export const createUserWatchlist = async ({ csrftoken, watchlistName }) => {
  const watchlistDetails = await fetch(`/api/stock/watchlistdetail/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify({ watchlistName }),
  }).then((res) => res.json());
  return watchlistDetails;
};

export const orderWatchlist = (watchlistStocks, orderedBy, orderDir) => {
  switch (orderedBy) {
    case "scrip":
      return Array.from(watchlistStocks).sort((a, b) =>
        a.stock.scrip > b.stock.scrip ? orderDir : -orderDir
      );
    case "date":
      return Array.from(watchlistStocks).sort((a, b) =>
        Math.log(new Date(a.date_added).getTime()) >
        Math.log(new Date(b.date_added).getTime())
          ? orderDir
          : -orderDir
      );
    case "addPrice":
      return Array.from(watchlistStocks).sort((a, b) =>
        a.price_when_added > b.price_when_added ? orderDir : -orderDir
      );
    case "ltp":
      return Array.from(watchlistStocks).sort((a, b) =>
        a.stock.ltp > b.stock.ltp ? orderDir : -orderDir
      );
    case "change":
      return Array.from(watchlistStocks).sort((a, b) =>
        a.stock.change > b.stock.change ? orderDir : -orderDir
      );
    case "changePercent":
      return Array.from(watchlistStocks).sort((a, b) =>
        a.stock.ltp / (a.stock.ltp - a.stock.change) - 1 >
        b.stock.ltp / (b.stock.ltp - b.stock.change) - 1
          ? orderDir
          : -orderDir
      );
    default:
      return watchlistStocks;
  }
};

export const deleteMultipleWatchlistStocks = async ({
  csrftoken,
  ...details
}) => {
  const statusCode = await fetch(`/api/stock/watchliststock/multipledelete/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify(details),
  }).then((res) => res.status);
  return statusCode;
};
