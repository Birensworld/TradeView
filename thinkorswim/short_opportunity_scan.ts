#
# Short Opportunity Scan - Stock Hacker Study Filter.
#
# DEBUG STEP 2: rebuilding the "upward move" leg with two clearer criteria
# instead of the Lowest/Highest %-move check:
#   1. Uptrend: the 50-day SMA today is higher than the 50-day SMA
#      risingLookback bars ago (default 15) - the average has been rising.
#   2. Today's high is a new high for the trailing yearLookback bars
#      (default 252, ~1 trading year) - a 1-year/52-week high, not the
#      stock's literal all-time record.
#
# Testing this pair in isolation before adding back the fading-candle and
# all-time-high checks. Report the match count.
#

input smaLength      = 50;  # SMA length used for the uptrend check
input risingLookback = 15;  # bars back the SMA is compared against to confirm it's rising
input yearLookback    = 252; # trading days considered "the year" for the high check

def sma50      = SimpleMovingAvg(close, smaLength);
def smaRising  = sma50 > sma50[risingLookback];

def yearHigh = high >= Highest(high[1], yearLookback);

plot scan = smaRising and yearHigh;
