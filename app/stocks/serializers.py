from rest_framework import serializers

from django.contrib.auth import get_user_model
from stocks.models import StockTable, WatchList, Portfolio, WatchListStock,\
    PortfolioStock, StockNews, StockPriceData, StockTransactions
import datetime


class StockSerializer(serializers.ModelSerializer):

    class Meta:
        model = StockTable
        fields = '__all__'


class WatchListStockSerializer(serializers.ModelSerializer):
    stock = StockSerializer(required=False)

    class Meta:
        model = WatchListStock
        fields = '__all__'


class WatchListSerializer(serializers.ModelSerializer):
    watchlistStocks = WatchListStockSerializer(many=True, required=False)

    class Meta:
        model = WatchList
        fields = ('pk', 'watchlist_name', 'user', 'watchlistStocks', )

    def create(self, validated_data):
        stocks_data = validated_data.pop('watchlistStocks', [])
        user = validated_data.pop('user')
        watchlist_name = validated_data.pop('watchlist_name', 'sample')
        watchlist = WatchList.objects.create(
            user=user, watchlist_name=watchlist_name)
        for stock_data in stocks_data:
            WatchListStock.objects.create(
                watchlist=watchlist, stock=StockTable.objects.get(scrip=stock_data.get('stock')))
        return watchlist

    def update(self, instance, validated_data):
        watchlist_id = instance.pk
        instance.delete()
        user = validated_data.get('user')
        watchlist_name = validated_data.get('watchlist_name', 'sample')
        instance = WatchList.objects.create(pk=watchlist_id,
                                            user=user, watchlist_name=watchlist_name)
        watchlist_stocks = validated_data.get('watchlistStocks', [])

        for watchlist_stock in watchlist_stocks:
            watchlist_stock_name = watchlist_stock.get('stock')
            W_stock = WatchListStock(
                stock=StockTable.objects.get(scrip=watchlist_stock_name), watchlist=instance)
            W_stock.save()
        return instance


class PortfolioStockSerializer(serializers.ModelSerializer):
    stock = StockSerializer(required=False)

    class Meta:
        model = PortfolioStock
        fields = '__all__'


class PortfolioSerializer(serializers.ModelSerializer):
    portfolioStocks = PortfolioStockSerializer(many=True, required=False)

    class Meta:
        model = Portfolio
        fields = ('pk', 'portfolio_name', 'user', 'portfolioStocks',)


class StockNewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockNews
        fields = '__all__'


class StockPriceDataSerializer(serializers.ModelSerializer):

    class Meta:
        model = StockPriceData
        fields = '__all__'


class StockTransactionsSerializer(serializers.ModelSerializer):

    class Meta:
        model = StockTransactions
        fields = '__all__'
