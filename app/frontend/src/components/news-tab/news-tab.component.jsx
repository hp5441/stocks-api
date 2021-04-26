import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { fetchNewsStart } from "../../redux/portfolio/portfolio.actions";

const NewsTab = (props) => {
  const { csrftoken, fetchNewsItems, newsItems, portfolio } = props;
  const [stockState, setStockState] = useState(new Set());
  const portfolioStocks = Object.values(portfolio)[0]
    ? Object.values(portfolio)[0].portfolioStocks
    : null;

  useEffect(() => {
    let changes = false;
    let tempState = stockState;
    if (portfolioStocks) {
      portfolioStocks.forEach(({ stock: { scrip } }) => {
        if (!stockState.has(scrip)) {
          tempState.add(scrip);
          changes = true;
        }
      });
    }
    if (changes) {
      fetchNewsItems(Array.from(tempState), csrftoken);
      setStockState(tempState);
    }
  }, [portfolioStocks, stockState, csrftoken, fetchNewsItems]);

  console.log(newsItems);
  return (
    <div className="news-container">
      {newsItems
        ? newsItems.map(
            (
              {
                news_id,
                date,
                stock_news_title,
                stock_news_type,
                stock_news_summary,
                stock_news_link,
                stock_news_attachment,
                stock,
              },
              ind
            ) => {
              return (
                <div style={{ width: "70%" }} key={news_id}>
                  <h3>
                    <a
                      href={stock_news_link}
                      style={{ textDecoration: "none" }}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {stock_news_title}
                    </a>
                  </h3>
                  <span>
                    {stock_news_type}{" "}
                    {new Date(date).toLocaleDateString("en-IN")}
                  </span>
                  {stock_news_attachment ? (
                    <span>
                      <a
                        href={stock_news_attachment}
                        style={{ textDecoration: "none", color: "red" }}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FontAwesomeIcon icon={faFilePdf} />
                      </a>
                    </span>
                  ) : null}

                  <p>{stock_news_summary}</p>
                  {ind !== newsItems.length - 1 ? (
                    <Divider variant="middle" />
                  ) : null}
                </div>
              );
            }
          )
        : null}
    </div>
  );
};

const mapStateToProps = ({
  userReducer: { csrftoken },
  portfolioReducer: { newsItems, portfolio },
}) => ({
  csrftoken: csrftoken,
  newsItems: newsItems,
  portfolio: portfolio,
});

const mapDispatchToProps = (dispatch) => ({
  fetchNewsItems: (stockDetails, csrftoken) => {
    dispatch(fetchNewsStart({ stockDetails, csrftoken }));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(NewsTab);
