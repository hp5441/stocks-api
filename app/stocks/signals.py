from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.core.cache import cache

from stocks.models import WatchList, WatchListStock, StockTable, StockTransactions, Portfolio, StockTransactions, StockPriceData

stocks = ['RELIANCE', 'MBLINFRA', 'ROSSARI', 'CAMS']


@receiver(post_save, sender=get_user_model())
def user_save_handler(sender, instance, created, **kwargs):
    watchlist_check = None
    portfolio_check = None
    if created:
        try:
            watchlist_check = WatchList.objects.get(user=instance)
            portfolio_check = Portfolio.objects.get(user=instance)
        except:
            pass
        if not watchlist_check:
            watchlist = WatchList(watchlist_name='sample', user=instance)
            watchlist.save()
            for stock in stocks:
                temp_stock = StockTable.objects.get(scrip=stock)
                print(temp_stock)
                watchlist_stock = WatchListStock(wstock_id=str(watchlist.pk)+"_"+stock,
                                                 watchlist=watchlist, stock=temp_stock)
                watchlist_stock.save()
        if not portfolio_check:
            portfolio = Portfolio(portfolio_name='My portfolio', user=instance)
            portfolio.save()


"""@receiver(post_save, sender=StockTable)
def stock_save_handler(sender, instance, created, **kwargs):
    stock_details = {}
    stock_details['ltp'] = instance.ltp
    stock_details['change'] = instance.change
    cache.set(instance.scrip, stock_details, 300)
    print(cache.get(instance.scrip))"""


"""@receiver(post_save, sender=StockTransactions)
def portfolio_graph_update(sender, instance, created, **kwargs):
    if created:
        portfolio_transactions = StockTransactions.objects.filter(
            portfolio=instance.portfolio).order_by("date")
        stocks_set = set()
        for transaction in portfolio_transactions:
            stocks_set.add(transaction.stock)
        
        for transaction in """
