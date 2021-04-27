from django.contrib.auth import get_user_model

from datetime import datetime, timedelta

from rest_framework import viewsets, generics, mixins, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly,\
    IsAuthenticated
from rest_framework.authentication import TokenAuthentication, SessionAuthentication

from stocks.models import StockTable, WatchList, Portfolio, WatchListStock, PortfolioStock, StockNews, StockPriceData, StockTransactions
from stocks.serializers import StockSerializer, WatchListSerializer,\
    PortfolioSerializer, WatchListStockSerializer, StockNewsSerializer, StockPriceDataSerializer, StockTransactionsSerializer

import json


class StockListView(generics.ListAPIView):
    #authentication_classes = (TokenAuthentication,)
    #permission_classes = (IsAuthenticatedOrReadOnly,)
    serializer_class = StockSerializer

    def get_queryset(self):
        return StockTable.objects.all()


class StockDetailView(generics.ListCreateAPIView, mixins.UpdateModelMixin, mixins.DestroyModelMixin, mixins.RetrieveModelMixin):
    #authentication_classes = (SessionAuthentication,)
    #permission_classes = (IsAuthenticated,)
    serializer_class = StockSerializer
    lookup_field = 'scrip'

    def get_queryset(self):
        return StockTable.objects.all()

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


class StockPriceUpdateView(APIView):

    def put(self, request):
        price_data = request.data
        print(price_data)
        price_data_keys = list(price_data.keys())

        stocksData = []
        noData = []
        for scrip_name in price_data_keys:
            tempStock = None
            try:
                tempStock = StockTable.objects.get(
                    scrip=scrip_name)
            except:
                print(scrip_name, "not in db")
            stocksData.append(tempStock)
        for i in range(len(price_data_keys)):
            if stocksData[i]:
                stocksData[i].ltp = float(
                    price_data[price_data_keys[i]]['ltp']) if price_data[price_data_keys[i]]['ltp'] else stocksData[i].ltp
                stocksData[i].change = float(
                    price_data[price_data_keys[i]]['change']) if price_data[price_data_keys[i]]['change'] else stocksData[i].change
            else:
                noData.append(i)
        for i in noData:
            del stocksData[i]
            print(i)
        StockTable.objects.bulk_update(stocksData, ['ltp', 'change'])
        return Response(status=status.HTTP_204_NO_CONTENT)


class WatchListView(generics.ListCreateAPIView):
    authentication_classes = (SessionAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = WatchListSerializer
    lookup_field = 'id'

    def get_queryset(self):
        print(self.request.user)
        user = self.request.user
        return WatchList.objects.filter(user=user)


class WatchListCreateDeleteView(APIView):
    authentication_classes = (SessionAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        watchlist_name = request.data['watchlistName']
        user = self.request.user
        watchlist = WatchList.objects.create(
            watchlist_name=watchlist_name, user=user)
        serializer = WatchListSerializer(watchlist)
        return Response(serializer.data)

    def put(self, request):
        watchlist_id = request.data['pk']
        watchList_name = request.data['watchlistName']
        user = self.request.user
        watchlist = WatchList.objects.get(pk=watchlist_id)
        watchlist.watchlist_name = watchList_name
        watchlist.save()
        watchlist.refresh_from_db()
        serializer = WatchListSerializer(watchlist)
        return Response(serializer.data)

    def delete(self, request, *args, **kwargs):
        watchlist_id = request.data['watchlistId']
        watchlist = WatchList.objects.get(pk=watchlist_id)
        watchlist.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class WatchListStockDetailView(APIView):
    authentication_classes = (SessionAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request, pk):
        print(self.request.user)
        stock_data = request.data['stock']
        stock = StockTable.objects.get(scrip=stock_data)
        watchlist = WatchList.objects.get(pk=pk)
        watchlistStock = WatchListStock.objects.create(wstock_id=str(
            watchlist.pk)+"_"+stock.scrip, stock=stock, watchlist=watchlist)
        serializer = WatchListStockSerializer(watchlistStock)
        return Response(serializer.data)

    def put(self, request, pk):
        prev_stock_data = request.data['prev_stock']
        stock_data = request.data['stock']
        stock = StockTable.objects.get(scrip=stock_data)
        watchlist = WatchList.objects.get(pk=pk)
        oldWatchlistStock = WatchListStock.objects.get(
            wstock_id=str(pk)+"_"+prev_stock_data)
        oldWatchlistStock.delete()
        watchlistStock = WatchListStock.objects.create(wstock_id=str(
            watchlist.pk)+"_"+stock.scrip, stock=stock, watchlist=watchlist)
        serializer = WatchListStockSerializer(watchlistStock)
        return Response(serializer.data)

    def delete(self, request, pk):
        stock_data = request.data['stock']
        watchlistStock = WatchListStock.objects.get(
            wstock_id=str(pk)+"_"+stock_data)
        watchlistStock.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class WatchListStockDeleteMultiple(APIView):
    authentication_classes = (SessionAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        print(self.request.user)
        stock_data = request.data['stocks']
        for stock in stock_data:
            WatchListStock.objects.get(
                wstock_id=stock).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PortfolioView(generics.ListCreateAPIView):
    authentication_classes = (SessionAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = PortfolioSerializer

    def get_queryset(self):
        user = self.request.user
        return Portfolio.objects.filter(user=user)


class PortfolioCreateDeleteView(APIView):
    authentication_classes = (SessionAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        portfolio_name = request.data['portfolioName']
        user = self.request.user
        portfolio = Portfolio.objects.create(
            portfolio_name=portfolio_name, user=user)
        serializer = PortfolioSerializer(portfolio)
        return Response(serializer.data)

    def put(self, request):
        portfolio_id = request.data['pk']
        portfolio_name = request.data['portfolioName']
        user = self.request.user
        portfolio = Portfolio.objects.get(pk=portfolio_id)
        portfolio.portfolio_name = portfolio_name
        portfolio.save()
        portfolio.refresh_from_db()
        serializer = PortfolioSerializer(portfolio)
        return Response(serializer.data)

    def delete(self, request, *args, **kwargs):
        portfolio_id = request.data['portfolioId']
        portfolio = Portfolio.objects.get(pk=portfolio_id)
        portfolio.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class StockTransactionView(APIView):

    def get(self, request):
        portfolio_id = request.query_params['p_id']
        transactions = StockTransactions.objects.filter(
            portfolio=portfolio_id).order_by('date')
        transactions_serialized = StockTransactionsSerializer(
            transactions, many=True)
        return Response(transactions_serialized.data)


class StockTransactionDetailView(APIView):

    def get(self, request):
        portfolio_stock = request.query_params['pstock']
        portfolio_id, stock = portfolio_stock.split("_")
        transactions = StockTransactions.objects.filter(
            portfolio=portfolio_id, stock=stock)
        transactions_serialized = StockTransactionsSerializer(
            transactions, many=True)
        return Response(transactions_serialized.data)

    def post(self, request):
        portfolio = Portfolio.objects.get(pk=request.data['portfolio_id'])
        stock = StockTable.objects.get(scrip=request.data['stock'])
        date = datetime.strptime(request.data['date'], "%Y-%m-%d").date()
        price = request.data['price']
        quantity = request.data['quantity']
        transaction_type = request.data['type']
        stock_transaction = StockTransactions.objects.create(
            portfolio=portfolio, stock=stock, date=date, transaction_type=transaction_type, quantity=quantity, price=price)
        transaction_serialized = StockTransactionsSerializer(stock_transaction)
        return Response(transaction_serialized.data)


class StockNewsView(APIView):
    serializer_class = StockNewsSerializer

    def get(self, request):
        scrip = request.query_params['stock']
        newsItems = StockNews.objects.filter(stock=scrip)
        newsItemsSerialized = StockNewsSerializer(newsItems, many=True)
        return Response(newsItemsSerialized.data)

    def post(self, request):
        scrip = request.data['stock']
        date = request.data['date']
        newstitle = request.data['news-title']
        newsitem = request.data['news-item']
        newstype = request.data['news-type']
        attachment = request.data.get("attachment")
        link = request.data.get("link")

        stocknews = StockNews.objects.create(
            stock=StockTable.objects.get(scrip=scrip), date=datetime.fromisoformat(date), stock_news_summary=newsitem, stock_news_title=newstitle,
            stock_news_type=newstype, stock_news_attachment=attachment, stock_news_link=link)
        serializer = StockNewsSerializer(stocknews)
        return Response(serializer.data)

    def delete(self, request):
        news_id = request.data['artifact_id']
        stocknews = StockNews.objects.get(news_id=news_id)
        stocknews.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class StockPriceView(APIView):
    serializer_class = StockPriceDataSerializer
    period_to_days = {"5Y": 365.25*5, "1Y": 365, "6M": 183, "1M": 31, "1W": 7}

    def get(self, request, scrip):
        print(scrip)
        period = request.query_params['period']
        from_date = request.query_params['from_date']
        stock_price_data = None
        if from_date:
            stock_price_data = StockPriceData.objects.filter(
                stock=StockTable.objects.get(scrip=scrip), date__gt=datetime.strptime(from_date, "%Y-%m-%d")).order_by('-date')
        elif period:
            stock_price_data = StockPriceData.objects.filter(
                stock=StockTable.objects.get(scrip=scrip), date__gt=datetime.now()-timedelta(days=self.period_to_days[period])).order_by('-date')
        stock_data_serialized = StockPriceDataSerializer(
            stock_price_data, many=True)
        return Response(stock_data_serialized.data)

    def post(self, request, scrip):
        scrip = request.data['stock']
        date = request.data['Date']
        high = request.data['High']
        low = request.data['Low']
        open_price = request.data['Open']
        close_price = request.data['Close']
        volume = request.data['Volume']
        adj_close = request.data['Adj_Close']

        stock_price_data = StockPriceData.objects.create(
            stock=StockTable.objects.get(scrip=scrip), date=datetime.fromisoformat(date).date(),
            high=high, low=low, open_price=open_price, close_price=close_price, volume=volume, adj_close=adj_close)
        serialized_stock_price = StockPriceDataSerializer(stock_price_data)
        return Response(serialized_stock_price.data)

    def delete(self, request, scrip):
        id = request.data['id']
        stock_price_data = StockPriceData.objects.get(pk=id)
        """StockPriceData.objects.filter(
            stock=StockTable.objects.get(scrip=scrip))"""
        stock_price_data.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MultiStockNewsView(APIView):
    serializer_class = StockNewsSerializer

    def post(self, request):
        stocklist = request.data['stocks']
        filtered_news = StockNews.objects.filter(
            stock=StockTable.objects.get(scrip=stocklist[0])).order_by("-date")[:10] if stocklist[0] else None
        for scrip in stocklist[1:]:
            filtered_news = filtered_news | StockNews.objects.filter(
                stock=StockTable.objects.get(scrip=scrip)).order_by("-date")[:10]
        filtered_news.order_by("-date")
        serialized_filtered_stocks = StockNewsSerializer(
            filtered_news, many=True)
        return Response(serialized_filtered_stocks.data)
