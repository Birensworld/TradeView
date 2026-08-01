#
# Potential Morning Star Study (chart overlay) - 2-candle, unconfirmed
# Same logic as bullish_reversal_scan.ts, for visually verifying hits on a daily
# chart. Apply via: Studies > Edit Studies > Create, paste this in, add to chart.
#

input windowDays        = 14;  # trading days before day 1 checked for the downtrend
input minHigherCloseDays = 8;  # majority of the OTHER window days must close above today's close
input longBodyPct       = 0.5; # day-1 body must be >= this fraction of its high-low range
input smallBodyPct      = 0.3; # day-2 body must be <= this fraction of its high-low range
input longWickPct       = 0.5; # day-2 lower wick must be >= this fraction of its high-low range

# ---- Day 2 / today (bar 0): small body with a long lower wick (the "star") ----
def day2Range     = high - low;
def day2Body      = AbsValue(close - open);
def day2LowerWick = Min(open, close) - low;
def day2Small     = day2Range > 0 and day2Body <= day2Range * smallBodyPct;
def day2LongWick  = day2Range > 0 and day2LowerWick >= day2Range * longWickPct;

# ---- Day 1 (bar 1, previous day): red, long-bodied, closes within today's range ----
# Day 1's close must land inside today's high-low range - not below it - so there's
# no gap-down/undercut of today's low by the prior day's close.
def day1Bearish       = close[1] < open[1];
def day1Range         = high[1] - low[1];
def day1Body          = open[1] - close[1];
def day1Long          = day1Range > 0 and day1Body >= day1Range * longBodyPct;
def day1WithinToday   = close[1] >= low and close[1] <= high;

# ---- Prior downtrend: majority of the OTHER window days (bars 2..windowDays+1) closed ----
# ---- above today's close, confirming today is actually the low of the window ----
def higherCloseCount = fold i = 2 to windowDays + 2
    with count = 0
    do count + (if GetValue(close, i) > close then 1 else 0);

def priorDowntrend = higherCloseCount >= minHigherCloseDays;

def signal = priorDowntrend
         and day1Bearish and day1Long and day1WithinToday
         and day2Small and day2LongWick;

plot Marker = if signal then low - (high - low) * 0.15 else Double.NaN;
Marker.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
Marker.SetDefaultColor(Color.CYAN);
Marker.SetLineWeight(3);

AddChartBubble(signal, low, "REV", Color.WHITE, no);
AssignPriceColor(if signal then Color.CYAN else Color.CURRENT);

Alert(signal, "Potential Morning Star setup: long red day + long-wick star day", Alert.BAR, Sound.Ring);

# ---- Diagnostic: confirms what date ToS is treating as bar 0 ("today") ----
# If this doesn't match today's actual date when you check after the close,
# the platform's daily bar hasn't rolled over yet - that's a data-timing issue,
# not a script issue. Remove this once you've confirmed timing is correct.
AddLabel(yes, "Bar 0 date: " + GetYYYYMMDD(), Color.WHITE);
