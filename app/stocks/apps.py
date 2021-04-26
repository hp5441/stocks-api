from django.apps import AppConfig


class StocksConfig(AppConfig):
    name = 'stocks'

    def ready(self):
        print('at ready')
        import stocks.signals
