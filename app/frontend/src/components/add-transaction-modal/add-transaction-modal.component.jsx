import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  FormControl,
  IconButton,
  InputLabel,
  Select,
  TextField,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { KeyboardDatePicker } from "@material-ui/pickers";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { portfolioStockTransactionStart } from "../../redux/portfolio/portfolio.actions";
import { closeModal } from "../../redux/user/user.actions";
import ModalWrapper from "../modal-wrapper/modal-wrapper.component";

import "./add-transaction-modal.styles.scss";

const AddTransactionModal = (props) => {
  const {
    modal,
    closeModal,
    stocks,
    transactions,
    portfolio,
    csrftoken,
    addTransaction,
  } = props;

  const [stockId, setStockId] = useState(
    modal.pstock_id ? modal.pstock_id : ""
  );
  const [date, setDate] = useState(new Date());
  const [stockValue, setStockValue] = useState(
    modal.pstock_id ? modal.name : null
  );
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [transactionType, setTransactionType] = useState("B");
  const [transactionQuantity, setTransactionQuantity] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (portfolio && filteredStocks.length === 1) {
      setStockId(
        Object.keys(portfolio)[0].toString() + "_" + filteredStocks[0].scrip
      );
      console.log(stockId);
    }
  }, [filteredStocks, stockId, portfolio]);

  const showHints = (searchTerm) => {
    const tempStocks = [];
    stocks.forEach((stock) => {
      if (
        stock.scrip.substr(0, searchTerm.length).toUpperCase() ===
          searchTerm.toUpperCase() ||
        stock.name.substr(0, searchTerm.length).toUpperCase() ===
          searchTerm.toUpperCase()
      ) {
        tempStocks.push(stock);
      }
    });
    setFilteredStocks(tempStocks);
  };

  const handleChangeMat = (e, v) => {
    console.log(v);
    setStockValue(v);
    if (v.length >= 3) {
      showHints(v);
    } else {
      setFilteredStocks([]);
    }
  };

  const handleChangeType = (e) => {
    setTransactionType(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(date.getTime());

    if (parseInt(transactionQuantity) <= 0 || parseInt(price) <= 0) {
      window.alert("negative quantity");
      return null;
    }

    if (stockId && transactions && transactions[stockId]) {
      let index = 0;

      console.log(transactions[stockId]);
      //creating a temporary array to check if its feasible to add transaction
      transactions[stockId].forEach(({ date: tDate }) => {
        if (new Date(tDate).getTime() <= date.getTime()) index += 1;
        console.log(index, "from temp");
      });

      const tempTranasactions = [...transactions[stockId]];

      tempTranasactions.splice(index, 0, {
        transaction_type: transactionType,
        quantity: transactionQuantity,
      });

      console.log(tempTranasactions, "from temp");
      let checkNegative = 0;
      tempTranasactions.forEach(({ transaction_type, quantity }) => {
        if (transaction_type === "B") {
          checkNegative += quantity;
        } else {
          checkNegative -= quantity;
        }
        if (checkNegative < 0) {
          window.alert("negative");
          return null;
        }
      });
      if (checkNegative >= 0) {
        const [portfolioId, scrip] = stockId.split("_");
        addTransaction(
          {
            portfolio_id: parseInt(portfolioId),
            stock: scrip,
            date: date.toISOString().slice(0, 10),
            price: parseInt(price),
            quantity: parseInt(transactionQuantity),
            type: transactionType,
          },
          csrftoken,
          filteredStocks[0]
        );
      }
    } else if (stockId && transactions && !transactions[stockId]) {
      if (transactionType === "S") {
        window.alert("negative");
        return null;
      } else {
        const [portfolioId, scrip] = stockId.split("_");
        addTransaction(
          {
            portfolio_id: parseInt(portfolioId),
            stock: scrip,
            date: date.toISOString().slice(0, 10),
            price: parseInt(price),
            quantity: parseInt(transactionQuantity),
            type: transactionType,
          },
          csrftoken,
          filteredStocks[0]
        );
      }
    }
    closeModal();
  };

  return (
    <ModalWrapper>
      <form onSubmit={handleSubmit}>
        <div className="new-transaction-modal">
          <p className="header">Add Transaction</p>

          <KeyboardDatePicker
            className="transaction-date"
            variant="inline"
            format="dd/MM/yyyy"
            margin="normal"
            onChange={(e) => setDate(e)}
            value={date}
            size="small"
          />
          <Autocomplete
            className="stock-select"
            options={filteredStocks.map(({ name }) => name)}
            value={stockValue}
            disabled={modal.pstock_id ? true : false}
            onChange={(e, v) => console.log(e, v)}
            clearOnEscape={true}
            clearOnBlur={true}
            size="small"
            onInputChange={handleChangeMat}
            noOptionsText="add stock"
            style={{ width: "200px" }}
            renderInput={(params) => (
              <TextField
                required
                {...params}
                label="Add Stock"
                variant="outlined"
              />
            )}
          />
          <FormControl
            variant="outlined"
            required
            size="small"
            className="transaction-type"
          >
            <InputLabel htmlFor="outlined-type-native-simple">Type</InputLabel>
            <Select
              native
              value={transactionType}
              onChange={handleChangeType}
              label="Transaction type"
              inputProps={{
                name: "type",
                id: "outlined-type-native-simple",
              }}
            >
              <option aria-label="None" value="" />
              <option value={"B"}>Buy</option>
              <option value={"S"}>Sell</option>
            </Select>
          </FormControl>
          <TextField
            required
            className="transaction-quantity"
            type="number"
            id="outlined-quantity"
            label="quantity"
            variant="outlined"
            value={transactionQuantity}
            onChange={(e) => setTransactionQuantity(e.target.value)}
            size="small"
          />
          <TextField
            required
            className="transaction-price"
            type="number"
            id="outlined-price"
            label="price"
            variant="outlined"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            size="small"
          />
          <IconButton type="submit" className="transaction-add-button">
            <FontAwesomeIcon icon={faPlusCircle} />
          </IconButton>
        </div>
      </form>
    </ModalWrapper>
  );
};

const mapStateToProps = ({
  userReducer: { showModal, stocks, csrftoken },
  portfolioReducer: { isLoading, transactions, portfolio, transactionChanges },
}) => ({
  modal: showModal,
  loading: isLoading,
  stocks: stocks,
  transactions: transactions,
  portfolio: portfolio,
  csrftoken: csrftoken,
  transactionChanges: transactionChanges,
});

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => {
    dispatch(closeModal());
  },
  addTransaction: (transactionDetails, csrftoken, stockDetails) => {
    dispatch(
      portfolioStockTransactionStart({
        transactionDetails,
        csrftoken,
        stockDetails,
      })
    );
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddTransactionModal);
