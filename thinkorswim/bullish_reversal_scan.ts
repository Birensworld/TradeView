#
# Potential Morning Star Setup (Stock Hacker) - 2-candle, unconfirmed
#
# Flags the first two candles of a Morning Star before the 3rd/confirmation
# candle exists, so you can watch a name ahead of a possible reversal:
#   Day 1 (bar 1, yesterday): long bearish candle continuing the downtrend
#   Day 2 (bar 0, today - the scan day): small body with a long wick, showing
#     the rejection/indecision that a Morning Star's "star" candle needs
# No 3rd candle is required by design - day 3 hasn't happened yet when the scan
# fires; that candle is what would confirm the full Morning Star.
#
# Pair this Study Filter with these NATIVE Stock Hacker filters (no code needed,
# and they run first so the scan is fast):
#   Basic Info  > Optionable   = Yes
#   Basic Info  > Exchange     = NYSE
#   Basic Info  > Last Price   > 15
#   Basic Info  > Volume       > 3,000,000
#   Fundamental > Market Cap   > 50,000,000
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

plot scan = priorDowntrend and day1Bearish and day1Long and day2Small and day2LongWick;
