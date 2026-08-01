#
# Bullish Reversal Scan - Stock Hacker Study Filter.
#
# Matches the 2-candle "potential Morning Star" setup from bullish_reversal_study.ts:
#   Day 1 (bar 1, previous day): red, long-bodied, closes high in today's range
#   Day 2 (bar 0, today): body sits high in today's own range
#   Prior downtrend: no day in the 14 sessions before day 1 closed below day 1's
#     close, confirming day 1 is a genuine new low, not just one red day among
#     choppy action.
#
# Percent-style inputs below are whole numbers (50 = 50%), not fractions - a
# fraction (0.5) mistakenly entered as a whole number (50) was the cause of a
# long run of false "zero results" earlier. The downtrend window uses explicit
# unrolled comparisons rather than a fold loop, because thinkScript's fold
# construct was confirmed NOT to work reliably inside a Stock Hacker Study
# Filter (it silently produced zero matches no matter how loose the other
# criteria were). To change the window length, add/remove lines in
# belowDay1Count following the same close[n] < close[1] pattern.
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
input day1UpperBandPct = 50; # day-1 close must fall in the top this-% of today's range
input day2UpperBandPct = 60; # day-2 (today's) body must sit in the top this-% of today's range

def day1Bearish = close[1] < open[1];
def day1Range   = high[1] - low[1];
def day1Body    = open[1] - close[1];
def day1Long    = day1Range > 0 and day1Body >= day1Range * (longBodyPct / 100);

def day2Range       = high - low;
def day1WithinToday = day2Range > 0
                  and close[1] >= low + day2Range * (1 - day1UpperBandPct / 100)
                  and close[1] <= high;

def day2BodyLow     = Min(open, close);
def day2InUpperBand = day2Range > 0
                  and day2BodyLow >= low + day2Range * (1 - day2UpperBandPct / 100);

# ---- Prior downtrend: no day in the 14-day window closed below day 1's close ----
def belowDay1Count =
    (if close[2]  < close[1] then 1 else 0) +
    (if close[3]  < close[1] then 1 else 0) +
    (if close[4]  < close[1] then 1 else 0) +
    (if close[5]  < close[1] then 1 else 0) +
    (if close[6]  < close[1] then 1 else 0) +
    (if close[7]  < close[1] then 1 else 0) +
    (if close[8]  < close[1] then 1 else 0) +
    (if close[9]  < close[1] then 1 else 0) +
    (if close[10] < close[1] then 1 else 0) +
    (if close[11] < close[1] then 1 else 0) +
    (if close[12] < close[1] then 1 else 0) +
    (if close[13] < close[1] then 1 else 0) +
    (if close[14] < close[1] then 1 else 0) +
    (if close[15] < close[1] then 1 else 0);

def priorDowntrend = belowDay1Count == 0;

plot scan = day1Bearish and day1Long and day1WithinToday and day2InUpperBand and priorDowntrend;
