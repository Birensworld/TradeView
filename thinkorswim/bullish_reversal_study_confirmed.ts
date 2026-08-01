#
# Bullish Reversal Study (CONFIRMED, 3-candle) - chart overlay.
# Same logic as bullish_reversal_scan_confirmed.ts, for visually verifying hits
# on a daily chart. Apply via: Studies > Edit Studies > Create, paste this in.
#
#   Day 1 (bar 2): red, long-bodied, closes high in day 2's range
#   Day 2 (bar 1): body sits high in day 2's own range (the "star")
#   Day 3 / today (bar 0): confirmation - closes higher than day 2's close
#

input windowDays       = 14;  # trading days before day 1 checked for the downtrend
input longBodyPct      = 0.5; # day-1 body must be >= this fraction of its high-low range
input day1UpperBandPct = 0.5; # day-1 close must fall in the top fraction of day 2's range
input day2UpperBandPct = 0.6; # day-2 (star) body must sit in the top fraction of day 2's range
input minNegativeDays  = 7;   # how many of the window days must be red (close < open)

def day1Bearish = close[2] < open[2];
def day1Range   = high[2] - low[2];
def day1Body    = open[2] - close[2];
def day1Long    = day1Range > 0 and day1Body >= day1Range * longBodyPct;

def day2Range      = high[1] - low[1];
def day1WithinDay2 = day2Range > 0
                 and close[2] >= low[1] + day2Range * (1 - day1UpperBandPct)
                 and close[2] <= high[1];

def day2BodyLow     = Min(open[1], close[1]);
def day2InUpperBand = day2Range > 0
                  and day2BodyLow >= low[1] + day2Range * (1 - day2UpperBandPct);

# ---- Day 3 / today (bar 0): confirmation - closes above day 2's close ----
def day3Confirms = close > close[1];

# ---- Prior downtrend part 1: no day in the window closed below day 1's close ----
# Window is bars 3..(windowDays+2), the windowDays sessions immediately preceding
# day 1 (bar 2).
def belowDay1Count = fold i = 3 to windowDays + 3
    with cnt = 0
    do cnt + (if GetValue(close, i) < close[2] then 1 else 0);

# ---- Prior downtrend part 2: at least minNegativeDays of the window days are red ----
def negativeDayCount = fold j = 3 to windowDays + 3
    with cnt2 = 0
    do cnt2 + (if GetValue(close, j) < GetValue(open, j) then 1 else 0);

def priorDowntrend = belowDay1Count == 0 and negativeDayCount >= minNegativeDays;

def signal = priorDowntrend
         and day1Bearish and day1Long and day1WithinDay2
         and day2InUpperBand and day3Confirms;

plot Marker = if signal then low - (high - low) * 0.15 else Double.NaN;
Marker.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
Marker.SetDefaultColor(Color.CYAN);
Marker.SetLineWeight(3);

AddChartBubble(signal, low, "REV CONFIRMED", Color.WHITE, no);
AssignPriceColor(if signal then Color.CYAN else Color.CURRENT);

Alert(signal, "Confirmed Morning Star: long red day + star day + higher close today", Alert.BAR, Sound.Ring);
