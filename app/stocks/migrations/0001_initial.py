# Generated by Django 3.0.13 on 2021-04-21 05:12

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Portfolio',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('portfolio_name', models.CharField(max_length=255)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='StockTable',
            fields=[
                ('scrip', models.CharField(max_length=50, primary_key=True, serialize=False, unique=True)),
                ('name', models.CharField(max_length=255)),
                ('ltp', models.FloatField()),
                ('change', models.FloatField()),
                ('marketcap', models.FloatField(blank=True, null=True)),
                ('pe_ratio', models.FloatField(blank=True, null=True)),
                ('pb_ratio', models.FloatField(blank=True, null=True)),
                ('de_ratio', models.FloatField(blank=True, null=True)),
                ('industry_pe', models.FloatField(blank=True, null=True)),
                ('eps', models.FloatField(blank=True, null=True)),
                ('promoter_holding', models.FloatField(blank=True, null=True)),
                ('fii_holding', models.FloatField(blank=True, null=True)),
                ('dii_holding', models.FloatField(blank=True, null=True)),
                ('f_promoter_holding', models.FloatField(blank=True, null=True)),
                ('sector', models.CharField(blank=True, max_length=255, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='WatchList',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('watchlist_name', models.CharField(max_length=255)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='StockTransactions',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('transaction_type', models.CharField(choices=[('B', 'BUY'), ('S', 'SELL')], max_length=2)),
                ('quantity', models.IntegerField()),
                ('price', models.FloatField()),
                ('portfolio', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='stocks.Portfolio')),
                ('stock', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='stocks.StockTable')),
            ],
        ),
        migrations.CreateModel(
            name='StockPriceData',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('high', models.FloatField()),
                ('low', models.FloatField()),
                ('open_price', models.FloatField()),
                ('close_price', models.FloatField()),
                ('volume', models.PositiveIntegerField()),
                ('stock', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='stocks.StockTable')),
            ],
        ),
        migrations.CreateModel(
            name='StockNews',
            fields=[
                ('news_id', models.AutoField(primary_key=True, serialize=False)),
                ('date', models.DateTimeField()),
                ('stock_news_title', models.TextField()),
                ('stock_news_summary', models.TextField(blank=True, null=True)),
                ('stock_news_link', models.CharField(blank=True, max_length=255, null=True)),
                ('stock_news_attachment', models.CharField(blank=True, max_length=255, null=True)),
                ('stock_news_type', models.CharField(blank=True, max_length=255, null=True)),
                ('stock', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='stocks.StockTable')),
            ],
        ),
        migrations.CreateModel(
            name='PortfolioGraph',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('open_price', models.FloatField()),
                ('close_price', models.FloatField()),
                ('date', models.DateField()),
                ('Portfolio', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='portfolioGraph', to='stocks.Portfolio')),
            ],
        ),
        migrations.CreateModel(
            name='WatchListStock',
            fields=[
                ('wstock_id', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('date_added', models.DateTimeField(auto_now_add=True)),
                ('price_when_added', models.FloatField()),
                ('stock', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='stocks.StockTable')),
                ('watchlist', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='watchlistStocks', to='stocks.WatchList')),
            ],
            options={
                'unique_together': {('watchlist', 'stock')},
            },
        ),
        migrations.CreateModel(
            name='PortfolioStock',
            fields=[
                ('pstock_id', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('quantity', models.IntegerField()),
                ('portfolio', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='portfolioStocks', to='stocks.Portfolio')),
                ('stock', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='stocks.StockTable')),
            ],
            options={
                'unique_together': {('portfolio', 'stock')},
            },
        ),
    ]
