#
# Weekly SMA Ribbon - Stock Hacker scan condition
# Add via: Scan tab > Stock Hacker > Add Study Filter > Create, paste this in.
# Combine with the scanner's NATIVE filters (no code needed for these):
#   - Basic Info > Optionable = Yes   (real optionability flag, unlike Pine's proxy)
#   - Basic Info > Exchange = NYSE
#   - Basic Info > Last Price > 15
# Stock Hacker only scans equities/ETFs by default, so futures are already excluded.
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

plot scan = ribbonTight and crossAll;
