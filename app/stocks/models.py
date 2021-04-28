from django.db import models
from django.conf import settings

from django.contrib.postgres.fields import JSONField


class StockTable(models.Model):

    scrip = models.CharField(max_length=50, unique=True, primary_key=True)
    name = models.CharField(max_length=255)
    ltp = models.FloatField()
    change = models.FloatField()
    marketcap = models.FloatField(null=True, blank=True)
    pe_ratio = models.FloatField(null=True, blank=True)
    pb_ratio = models.FloatField(null=True, blank=True)
    de_ratio = models.FloatField(null=True, blank=True)
    industry_pe = models.FloatField(null=True, blank=True)
    eps = models.FloatField(null=True, blank=True)
    promoter_holding = models.FloatField(null=True, blank=True)
    fii_holding = models.FloatField(null=True, blank=True)
    dii_holding = models.FloatField(null=True, blank=True)
    f_promoter_holding = models.FloatField(null=True, blank=True)
    sector = models.CharField(max_length=255, null=True, blank=True)


class WatchList(models.Model):
    watchlist_name = models.CharField(max_length=255)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)


class WatchListStock(models.Model):
    wstock_id = models.CharField(max_length=100, primary_key=True)
    watchlist = models.ForeignKey(
        WatchList, related_name='watchlistStocks', on_delete=models.CASCADE)
    stock = models.ForeignKey(StockTable, on_delete=models.CASCADE)
    date_added = models.DateTimeField(auto_now_add=True)
    price_when_added = models.FloatField()

    class Meta:
        unique_together = [['watchlist', 'stock']]

    def save(self, *args, **kwargs):
        self.price_when_added = self.stock.ltp
        super(WatchListStock, self).save(*args, **kwargs)


class Portfolio(models.Model):
    portfolio_name = models.CharField(max_length=255)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)


class PortfolioStock(models.Model):
    pstock_id = models.CharField(max_length=100, primary_key=True)
    portfolio = models.ForeignKey(
        Portfolio, related_name='portfolioStocks', on_delete=models.CASCADE)
    stock = models.ForeignKey(StockTable, on_delete=models.CASCADE)
    quantity = models.IntegerField()

    class Meta:
        unique_together = [['portfolio', 'stock']]

    def delete(self, *args, **kwargs):
        portfolio, stock = self.pstock_id.split("_")
        transactions = StockTransactions.objects.filter(
            portfolio=portfolio, stock=StockTable.objects.get(scrip=stock))
        transactions.delete()
        super().delete(*args, **kwargs)


class PortfolioGraph(models.Model):
    Portfolio = models.ForeignKey(
        Portfolio, related_name='portfolioGraph', on_delete=models.CASCADE)
    open_price = models.FloatField()
    close_price = models.FloatField()
    date = models.DateField()


class StockNews(models.Model):
    news_id = models.AutoField(primary_key=True)
    stock = models.ForeignKey(StockTable, on_delete=models.CASCADE)
    date = models.DateTimeField()
    stock_news_title = models.TextField()
    stock_news_summary = models.TextField(null=True, blank=True)
    stock_news_link = models.CharField(null=True, blank=True, max_length=255)
    stock_news_attachment = models.CharField(
        null=True, blank=True, max_length=255)
    stock_news_type = models.CharField(null=True, blank=True, max_length=255)


class StockPriceData(models.Model):
    stock = models.ForeignKey(StockTable, on_delete=models.CASCADE)
    date = models.DateField(null=True, blank=True)
    high = models.FloatField(default=0)
    low = models.FloatField(default=0)
    adj_close = models.FloatField(default=0)
    open_price = models.FloatField(default=0)
    close_price = models.FloatField(default=0)
    volume = models.IntegerField(default=0)


class StockTransactions(models.Model):
    date = models.DateField()
    transaction_type = models.CharField(
        max_length=2, choices=[('B', 'BUY'), ('S', 'SELL')])
    stock = models.ForeignKey(StockTable, on_delete=models.CASCADE)
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price = models.FloatField()

    def save(self, *args, **kwargs):
        self.modify_or_create_porfolio_stock()

    def modify_or_create_porfolio_stock(self, *args, **kwargs):
        portfolio_stock = None
        try:
            portfolio_stock = PortfolioStock.objects.get(
                stock=self.stock, portfolio=self.portfolio)
        except:
            print("not found pstock")
        if portfolio_stock:
            if self.transaction_type == "B":
                portfolio_stock.quantity += self.quantity
            else:
                if portfolio_stock.quantity - self.quantity > 0:
                    portfolio_stock.quantity -= self.quantity
                elif portfolio_stock.quantity - self.quantity == 0:
                    portfolio_stock.quantity = 0
                else:
                    portfolio_stock.quantity -= self.quantity
                    raise Exception("quantity is less than 0")

            if portfolio_stock.quantity >= 0:
                portfolio_stock.save()
                portfolio_stock.refresh_from_db()
                super(StockTransactions, self).save(*args, **kwargs)

        else:
            if self.transaction_type == "B":
                portfolio_stock = PortfolioStock.objects.create(
                    pstock_id=str(self.portfolio.pk)+"_"+self.stock.scrip, portfolio=self.portfolio, stock=self.stock, quantity=self.quantity)
                portfolio_stock.refresh_from_db()
                super(StockTransactions, self).save(*args, **kwargs)
            else:
                raise Exception("price is less than 0")
