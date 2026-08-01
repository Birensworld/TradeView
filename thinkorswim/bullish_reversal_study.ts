#
# Bullish Reversal Study (chart overlay) - "Three Inside Up" candlestick pattern
# Same logic as bullish_reversal_scan.ts, for visually verifying hits on a daily
# chart. Apply via: Studies > Edit Studies > Create, paste this in, add to chart.
# See bullish_reversal_scan.ts for the Bulkowski performance data and sources.
#

input minLowerLows = 3;    # how many of the 5 days before the pattern must post a lower low
input longBodyPct  = 0.5;  # day-1 body must be >= this fraction of its high-low range

# ---- Prior downtrend: lower lows across the 5 trading days before day 1 ----
def lowerLowCount =
    (if low[3] < low[4] then 1 else 0) +
    (if low[4] < low[5] then 1 else 0) +
    (if low[5] < low[6] then 1 else 0) +
    (if low[6] < low[7] then 1 else 0) +
    (if low[7] < low[8] then 1 else 0);

def priorDowntrend = lowerLowCount >= minLowerLows;

# ---- Day 1 (bar 2): long bearish candle continuing the downtrend ----
def day1Bearish = close[2] < open[2];
def day1Range   = high[2] - low[2];
def day1Body    = open[2] - close[2];
def day1Long    = day1Range > 0 and day1Body >= day1Range * longBodyPct;

# ---- Day 2 (bar 1): bullish harami - body fully inside day 1's body ----
def day2Bullish = close[1] > open[1];
def day2Inside  = Max(open[1], close[1]) <= open[2] and Min(open[1], close[1]) >= close[2];

# ---- Day 3 / today (bar 0): bullish confirmation, closes above day 1's close ----
def day3Bullish  = close > open;
def day3Confirms = close > close[2];

def signal = priorDowntrend
         and day1Bearish and day1Long
         and day2Bullish and day2Inside
         and day3Bullish and day3Confirms;

plot Marker = if signal then low - (high - low) * 0.15 else Double.NaN;
Marker.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
Marker.SetDefaultColor(Color.CYAN);
Marker.SetLineWeight(3);

AddChartBubble(signal, low, "3 INSIDE UP", Color.CYAN, no);
AssignPriceColor(if signal then Color.CYAN else Color.CURRENT);

Alert(signal, "Bullish reversal: Three Inside Up pattern confirmed", Alert.BAR, Sound.Ring);
