#
# Bullish Reversal Scan (CONFIRMED, 3-candle) - Stock Hacker Study Filter.
#
# Same setup as bullish_reversal_scan.ts, but shifted back one bar and with a
# 3rd confirmation candle added on today (bar 0):
#   Day 1 (bar 2): red, long-bodied, closes high in day 2's range
#   Day 2 (bar 1): body sits high in day 2's own range (the "star")
#   Day 3 / today (bar 0): confirmation - closes higher than day 2's close
#   Prior downtrend: day 1 must be the low of the 14 sessions before it, AND at
#     least minNegativeDays of those 14 days must be red.
#
# Percent-style inputs are whole numbers (50 = 50%), not fractions - see
# bullish_reversal_scan.ts for why. The downtrend window uses explicit unrolled
# comparisons rather than a fold loop, since fold was confirmed NOT to work
# reliably inside a Stock Hacker Study Filter.
#
# Pair this Study Filter with these NATIVE Stock Hacker filters (no code needed,
# and they run first so the scan is fast):
#   Basic Info  > Optionable   = Yes
#   Basic Info  > Exchange     = NYSE
#   Basic Info  > Last Price   > 15
#   Basic Info  > Volume       > 3,000,000
#   Fundamental > Market Cap   > 50,000,000
#

input longBodyPct      = 50; # day-1 body must be >= this % of its own high-low range
input day1UpperBandPct = 50; # day-1 close must fall in the top this-% of day 2's range
input day2UpperBandPct = 60; # day-2 (star) body must sit in the top this-% of day 2's range
input minNegativeDays  = 7;  # how many of the 14 window days must be red (close < open)

def day1Bearish = close[2] < open[2];
def day1Range   = high[2] - low[2];
def day1Body    = open[2] - close[2];
def day1Long    = day1Range > 0 and day1Body >= day1Range * (longBodyPct / 100);

def day2Range      = high[1] - low[1];
def day1WithinDay2 = day2Range > 0
                 and close[2] >= low[1] + day2Range * (1 - day1UpperBandPct / 100)
                 and close[2] <= high[1];

def day2BodyLow     = Min(open[1], close[1]);
def day2InUpperBand = day2Range > 0
                  and day2BodyLow >= low[1] + day2Range * (1 - day2UpperBandPct / 100);

# ---- Day 3 / today (bar 0): confirmation - closes above day 2's close ----
def day3Confirms = close > close[1];

# ---- Prior downtrend part 1: no day in the 14-day window closed below day 1's close ----
def belowDay1Count =
    (if close[3]  < close[2] then 1 else 0) +
    (if close[4]  < close[2] then 1 else 0) +
    (if close[5]  < close[2] then 1 else 0) +
    (if close[6]  < close[2] then 1 else 0) +
    (if close[7]  < close[2] then 1 else 0) +
    (if close[8]  < close[2] then 1 else 0) +
    (if close[9]  < close[2] then 1 else 0) +
    (if close[10] < close[2] then 1 else 0) +
    (if close[11] < close[2] then 1 else 0) +
    (if close[12] < close[2] then 1 else 0) +
    (if close[13] < close[2] then 1 else 0) +
    (if close[14] < close[2] then 1 else 0) +
    (if close[15] < close[2] then 1 else 0) +
    (if close[16] < close[2] then 1 else 0);

# ---- Prior downtrend part 2: at least minNegativeDays of the 14 window days are red ----
def negativeDayCount =
    (if close[3]  < open[3]  then 1 else 0) +
    (if close[4]  < open[4]  then 1 else 0) +
    (if close[5]  < open[5]  then 1 else 0) +
    (if close[6]  < open[6]  then 1 else 0) +
    (if close[7]  < open[7]  then 1 else 0) +
    (if close[8]  < open[8]  then 1 else 0) +
    (if close[9]  < open[9]  then 1 else 0) +
    (if close[10] < open[10] then 1 else 0) +
    (if close[11] < open[11] then 1 else 0) +
    (if close[12] < open[12] then 1 else 0) +
    (if close[13] < open[13] then 1 else 0) +
    (if close[14] < open[14] then 1 else 0) +
    (if close[15] < open[15] then 1 else 0) +
    (if close[16] < open[16] then 1 else 0);

def priorDowntrend = belowDay1Count == 0 and negativeDayCount >= minNegativeDays;

plot scan = day1Bearish and day1Long and day1WithinDay2 and day2InUpperBand
        and priorDowntrend and day3Confirms;
