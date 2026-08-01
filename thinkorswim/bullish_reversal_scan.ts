#
# Bullish Reversal Scan (Stock Hacker)
#
# Pair this Study Filter with these NATIVE Stock Hacker filters (no code needed,
# and they run first so the scan is fast):
#   Basic Info  > Optionable   = Yes
#   Basic Info  > Exchange     = NYSE
#   Basic Info  > Last Price   > 15
#   Basic Info  > Volume       > 3,000,000
#   Fundamental > Market Cap   > 50,000,000
#
# This script only encodes what native filters can't: the prior downtrend and
# today's hammer-style upside reversal candle. Runs daily on the daily chart -
# bar 0 = today (the day the scan runs), bar 1 = yesterday, etc.
#

input minLowerLows    = 3;     # how many of the last 5 days must post a lower low
input maxBodyPct      = 0.3;   # body <= this fraction of today's high-low range
input minLowerWickPct = 0.5;   # lower wick >= this fraction of today's range
input maxUpperWickPct = 0.25;  # upper wick <= this fraction of today's range

# ---- Downtrend check: lower lows across the 5 trading days before today ----
def lowerLowCount =
    (if low[1] < low[2] then 1 else 0) +
    (if low[2] < low[3] then 1 else 0) +
    (if low[3] < low[4] then 1 else 0) +
    (if low[4] < low[5] then 1 else 0) +
    (if low[5] < low[6] then 1 else 0);

def downtrend = lowerLowCount >= minLowerLows;

# ---- Today's hammer-style upside reversal ----
def o = open;
def c = close;
def h = high;
def l = low;
def range = h - l;
def body = AbsValue(c - o);
def lowerWick = Min(o, c) - l;
def upperWick = h - Max(o, c);
def closedUpperHalf = c >= l + range * 0.5;

def hammer = range > 0
         and body <= range * maxBodyPct
         and lowerWick >= range * minLowerWickPct
         and upperWick <= range * maxUpperWickPct
         and closedUpperHalf;

plot scan = downtrend and hammer;
