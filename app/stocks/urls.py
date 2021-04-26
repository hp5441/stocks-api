from django.urls import path
from stocks import views

app_name = 'stocks'
urlpatterns = [
    path("stocks/", views.StockListView.as_view(), name="stocklist"),
    path("stocksdetail/<str:scrip>/",
         views.StockDetailView.as_view(), name="stocklist"),
    path("stockupdate/", views.StockPriceUpdateView.as_view(), name="stock_update"),
    path("watchlist/", views.WatchListView.as_view(), name="watchlist"),
    path("watchlistdetail/",
         views.WatchListCreateDeleteView.as_view(), name="watchlist"),
    path("watchliststock/<int:pk>/",
         views.WatchListStockDetailView.as_view(), name="watchlist_detail"),
    path("watchliststock/multipledelete/",
         views.WatchListStockDeleteMultiple.as_view(), name="watchlist_delete"),
    path("portfolio/", views.PortfolioView.as_view(), name="portfolio"),
    path("portfoliodetail/",
         views.PortfolioCreateDeleteView.as_view(), name="portfolio"),
    path("transactions/", views.StockTransactionView.as_view(), name="transactions"),
    path("transactionsdetail/",
         views.StockTransactionDetailView.as_view(), name="transactions"),
    path("stocknews/", views.StockNewsView.as_view(), name="stock_news"),
    path("stockprice/<str:scrip>/",
         views.StockPriceView.as_view(), name="stock_price"),
    path("stocknewsrange/", views.MultiStockNewsView.as_view(),
         name="stock_news_items"),
]
