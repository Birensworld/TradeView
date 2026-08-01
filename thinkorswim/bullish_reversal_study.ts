#
# Potential Morning Star Study (chart overlay) - 2-candle, unconfirmed
# Same logic as bullish_reversal_scan.ts, for visually verifying hits on a daily
# chart. Apply via: Studies > Edit Studies > Create, paste this in, add to chart.
#

input minLowerLows = 3;    # how many of the 5 days before day 1 must post a lower low
input longBodyPct  = 0.5;  # day-1 body must be >= this fraction of its high-low range
input smallBodyPct = 0.3;  # day-2 body must be <= this fraction of its high-low range
input longWickPct  = 0.5;  # day-2 lower wick must be >= this fraction of its high-low range

# ---- Prior downtrend: lower lows across the 5 trading days before day 1 ----
def lowerLowCount =
    (if low[2] < low[3] then 1 else 0) +
    (if low[3] < low[4] then 1 else 0) +
    (if low[4] < low[5] then 1 else 0) +
    (if low[5] < low[6] then 1 else 0) +
    (if low[6] < low[7] then 1 else 0);

def priorDowntrend = lowerLowCount >= minLowerLows;

# ---- Day 1 (bar 1): long bearish candle continuing the downtrend ----
def day1Bearish = close[1] < open[1];
def day1Range   = high[1] - low[1];
def day1Body    = open[1] - close[1];
def day1Long    = day1Range > 0 and day1Body >= day1Range * longBodyPct;

# ---- Day 2 / today (bar 0): small body with a long lower wick (the "star") ----
def day2Range     = high - low;
def day2Body      = AbsValue(close - open);
def day2LowerWick = Min(open, close) - low;
def day2Small     = day2Range > 0 and day2Body <= day2Range * smallBodyPct;
def day2LongWick  = day2Range > 0 and day2LowerWick >= day2Range * longWickPct;

def signal = priorDowntrend and day1Bearish and day1Long and day2Small and day2LongWick;

plot Marker = if signal then low - (high - low) * 0.15 else Double.NaN;
Marker.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
Marker.SetDefaultColor(Color.CYAN);
Marker.SetLineWeight(3);

AddChartBubble(signal, low, "POTENTIAL MORNING STAR", Color.GRAY, no);
AssignPriceColor(if signal then Color.CYAN else Color.CURRENT);

Alert(signal, "Potential Morning Star setup: long red day + long-wick star day", Alert.BAR, Sound.Ring);
