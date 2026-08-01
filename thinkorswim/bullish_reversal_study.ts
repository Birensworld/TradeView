#
# Potential Morning Star Study (chart overlay) - 2-candle, unconfirmed
# Same logic as bullish_reversal_scan.ts, for visually verifying hits on a daily
# chart. Apply via: Studies > Edit Studies > Create, paste this in, add to chart.
#

input windowDays       = 14;  # trading days before day 1 checked for the downtrend
input longBodyPct      = 0.5; # day-1 body must be >= this fraction of its high-low range
input day1UpperBandPct = 0.5; # day-1 close must fall in the top fraction of today's range
input day2UpperBandPct = 0.6; # day-2 (today's) body must reside in the top fraction of today's range
input minNegativeDays  = 7;   # how many of the window days must be red (close < open)

# ---- Day 2 / today (bar 0): body sits in the upper day2UpperBandPct of today's range ----
def day2Range       = high - low;
def day2BodyLow     = Min(open, close);
def day2InUpperBand = day2Range > 0 and day2BodyLow >= low + day2Range * (1 - day2UpperBandPct);

# ---- Day 1 (bar 1, previous day): red, long-bodied, closes in today's upper band ----
# Day 1's close must land in the upper day1UpperBandPct of today's high-low range,
# so there's real separation between the prior day's close and today's low.
def day1Bearish       = close[1] < open[1];
def day1Range         = high[1] - low[1];
def day1Body          = open[1] - close[1];
def day1Long          = day1Range > 0 and day1Body >= day1Range * longBodyPct;
def day1WithinToday   = day2Range > 0
                    and close[1] >= low + day2Range * (1 - day1UpperBandPct)
                    and close[1] <= high;

# ---- Prior downtrend part 1: no day in the 14-day window closed below day 1's close ----
# Window is bars 2..(windowDays+1), the windowDays sessions immediately preceding
# day 1. This confirms day 1 is a genuine new low for the period, not just one red
# day among choppy price action.
def belowDay1Count = fold i = 2 to windowDays + 2
    with cnt = 0
    do cnt + (if GetValue(close, i) < close[1] then 1 else 0);

# ---- Prior downtrend part 2: at least minNegativeDays of the window days are red ----
# Real down markets have up days mixed in, so this doesn't require every day to
# post a lower close (belowDay1Count already guarantees day 1 is the window's
# low) - it just requires a majority of red days across the window.
def negativeDayCount = fold j = 2 to windowDays + 2
    with cnt2 = 0
    do cnt2 + (if GetValue(close, j) < GetValue(open, j) then 1 else 0);

def priorDowntrend = belowDay1Count == 0 and negativeDayCount >= minNegativeDays;

def signal = priorDowntrend
         and day1Bearish and day1Long and day1WithinToday
         and day2InUpperBand;

plot Marker = if signal then low - (high - low) * 0.15 else Double.NaN;
Marker.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
Marker.SetDefaultColor(Color.CYAN);
Marker.SetLineWeight(3);

AddChartBubble(signal, low, "REV", Color.WHITE, no);
AssignPriceColor(if signal then Color.CYAN else Color.CURRENT);

Alert(signal, "Potential Morning Star setup: long red day + upper-range star day", Alert.BAR, Sound.Ring);

# ---- Diagnostic: confirms what date ToS is treating as bar 0 ("today") ----
# If this doesn't match today's actual date when you check after the close,
# the platform's daily bar hasn't rolled over yet - that's a data-timing issue,
# not a script issue. Remove this once you've confirmed timing is correct.
AddLabel(yes, "Bar 0 date: " + GetYYYYMMDD(), Color.WHITE);
