import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import {
  portfolioStockDeleteStart,
  portfolioStockTransactionDeleteStart,
} from "../../redux/portfolio/portfolio.actions";
import { closeModal } from "../../redux/user/user.actions";
import CustomButton from "../custom-button/custom-button.component";
import ModalWrapper from "../modal-wrapper/modal-wrapper.component";

const DeleteTransactionModal = (props) => {
  const {
    modal,
    transactions,
    csrftoken,
    deleteTransaction,
    closeModal,
    deletePortfolioStock,
  } = props;

  const [deletedStock, setDeletedStock] = useState(false);

  useEffect(() => {
    if (deletedStock) {
      <Redirect push to="/portfolio" />;
    }
  }, [deletedStock]);

  const handleClick = (e) => {
    console.log(modal);
    if (modal.pstock_id && transactions && transactions[modal.pstock_id]) {
      console.log(transactions[modal.pstock_id]);
      //creating a temporary array to check if its feasible to add transaction

      let tempTransactions = [...transactions[modal.pstock_id]];

      if (modal.modalType ? modal.modalType === "deleteTransaction" : null) {
        tempTransactions = tempTransactions.filter(({ id }) => {
          return id !== modal.id;
        });
      }

      console.log(tempTransactions, "from temp");
      let checkNegative = 0;
      tempTransactions.forEach(({ transaction_type, quantity }) => {
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
        console.log(tempTransactions.length, "from goji");
        if (tempTransactions.length > 1) {
          deleteTransaction(
            {
              id: modal.id,
              pstock_id: modal.pstock_id,
            },
            csrftoken
          );
        } else {
          deletePortfolioStock({ pstock_id: modal.pstock_id }, csrftoken);
          setDeletedStock(true);
        }
      }
    }
    closeModal();
  };
  return (
    <ModalWrapper>
      <h3>hello</h3>
      <p>would you like to delete</p>
      <CustomButton onClick={handleClick} />
    </ModalWrapper>
  );
};
const mapStateToProps = ({
  userReducer: { showModal, csrftoken },
  portfolioReducer: { transactions },
}) => ({
  modal: showModal,
  csrftoken: csrftoken,
  transactions: transactions,
});

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => {
    dispatch(closeModal());
  },
  deleteTransaction: (transactionDetails, csrftoken) => {
    dispatch(
      portfolioStockTransactionDeleteStart({
        transactionDetails,
        csrftoken,
      })
    );
  },
  deletePortfolioStock: (portfolioStockDetails, csrftoken) => {
    dispatch(portfolioStockDeleteStart({ portfolioStockDetails, csrftoken }));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteTransactionModal);
