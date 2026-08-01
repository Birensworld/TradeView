#
# Potential Morning Star Study (chart overlay) - 2-candle, unconfirmed
# Same logic as bullish_reversal_scan.ts, for visually verifying hits on a daily
# chart. Apply via: Studies > Edit Studies > Create, paste this in, add to chart.
#

input windowDays      = 14; # trading days before day 1 checked for the downtrend
input minNegativeDays = 8;  # how many of those days must close negative (red)
input longBodyPct    = 0.5; # day-1 body must be >= this fraction of its high-low range
input smallBodyPct   = 0.3; # day-2 body must be <= this fraction of its high-low range
input longWickPct    = 0.5; # day-2 lower wick must be >= this fraction of its high-low range

# ---- Prior downtrend: count of negative (red) days across the window before day 1 ----
# Window is bars 2 .. (windowDays + 1), i.e. the windowDays sessions immediately
# preceding day 1 (bar 1). Steeper/tighter trend = raise minNegativeDays or windowDays.
def negativeDayCount = fold i = 2 to windowDays + 2
    with count = 0
    do count + (if GetValue(close, i) < GetValue(open, i) then 1 else 0);

def priorDowntrend = negativeDayCount >= minNegativeDays;

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

# ---- Diagnostic: confirms what date ToS is treating as bar 0 ("today") ----
# If this doesn't match today's actual date when you check after the close,
# the platform's daily bar hasn't rolled over yet - that's a data-timing issue,
# not a script issue. Remove this once you've confirmed timing is correct.
AddLabel(yes, "Bar 0 date: " + GetYYYYMMDD(), Color.WHITE);
