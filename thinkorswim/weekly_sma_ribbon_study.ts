#
# Weekly SMA Ribbon Study (chart overlay)
# Plots the weekly 10/20/30/40 SMAs on any lower-timeframe chart and flags bars
# where the ribbon is tight (within tightPct%) with the 10w SMA crossing the others.
# Apply via: Studies > Edit Studies > Create, paste this in, then add to chart.
#

input fastLength = 10;
input len2       = 20;
input len3       = 30;
input len4       = 40;
input tightPct   = 1.0;

def sma10w = SimpleMovingAvg(close(period = AggregationPeriod.WEEK), fastLength);
def sma20w = SimpleMovingAvg(close(period = AggregationPeriod.WEEK), len2);
def sma30w = SimpleMovingAvg(close(period = AggregationPeriod.WEEK), len3);
def sma40w = SimpleMovingAvg(close(period = AggregationPeriod.WEEK), len4);

def hiSMA = Max(Max(sma10w, sma20w), Max(sma30w, sma40w));
def loSMA = Min(Min(sma10w, sma20w), Min(sma30w, sma40w));
def spreadPct = (hiSMA - loSMA) / loSMA * 100;
def ribbonTight = spreadPct <= tightPct;

def cross20 = sma10w crosses above sma20w;
def cross30 = sma10w crosses above sma30w;
def cross40 = sma10w crosses above sma40w;
def crossAll = cross20 and cross30 and cross40;

def bullAligned = sma10w > sma20w and sma20w > sma30w and sma30w > sma40w;
def signal = ribbonTight and crossAll;

plot SMA10W = sma10w;
plot SMA20W = sma20w;
plot SMA30W = sma30w;
plot SMA40W = sma40w;

SMA10W.SetDefaultColor(Color.GREEN);
SMA20W.SetDefaultColor(Color.YELLOW);
SMA30W.SetDefaultColor(Color.ORANGE);
SMA40W.SetDefaultColor(Color.RED);
SMA10W.SetLineWeight(2);
SMA20W.SetLineWeight(2);
SMA30W.SetLineWeight(2);
SMA40W.SetLineWeight(2);

AddChartBubble(signal, low, "RIBBON+CROSS", Color.CYAN, no);
AssignPriceColor(if signal then Color.CYAN else Color.CURRENT);

Alert(signal, "Weekly SMA ribbon tight + 10w crossed 20/30/40w", Alert.BAR, Sound.Ring);
