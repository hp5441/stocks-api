from django.test import TestCase

from stocks.models import StockTable


class ModelTests(TestCase):

    def test_check_stocktable(self):
        scrip = 'RELIANCE'

        stock = StockTable.objects.get(scrip=scrip)

        self.assertEquals(stock.scrip, scrip)
