#
# Bullish Reversal Scan (Stock Hacker) - "Three Inside Up" candlestick pattern
#
# Per Thomas Bulkowski's Encyclopedia of Chart Patterns / thepatternsite.com study
# of 103 candlestick patterns, Three Inside Up ranks #2 overall for bullish
# reversals: 65% reversal rate, average +2.61% rise over the next 10 days, and a
# frequency rank of 31/103 (common enough to actually appear in a daily scan,
# unlike several higher-ranked but near-zero-frequency patterns). It is also
# explicitly defined as occurring after a downtrend, matching the original
# requirement here. Sources:
#   https://thepatternsite.com/ThreeInsideUp.html
#   https://sacredtraders.com/the-eight-best-performing-candles-by-thomas-n-bulkowski/
#
# Pair this Study Filter with these NATIVE Stock Hacker filters (no code needed,
# and they run first so the scan is fast):
#   Basic Info  > Optionable   = Yes
#   Basic Info  > Exchange     = NYSE
#   Basic Info  > Last Price   > 15
#   Basic Info  > Volume       > 3,000,000
#   Fundamental > Market Cap   > 50,000,000
#
# Runs daily on the daily chart. Bar 0 = today (the confirmation/reversal day),
# bar 1 = the harami day, bar 2 = the long bearish day the pattern starts on.
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
def day3Bullish     = close > open;
def day3Confirms    = close > close[2];

plot scan = priorDowntrend
        and day1Bearish and day1Long
        and day2Bullish and day2Inside
        and day3Bullish and day3Confirms;
