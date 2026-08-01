#
# Bullish Reversal Scan - rebuilt from scratch, one criterion at a time.
# Building back up toward the logic in bullish_reversal_study.ts.
#
# STEP 3 (retest, hardcoded): day 1 is red AND long-bodied (body >= 50% of its
# own high-low range). Threshold is hardcoded (no input) to rule out a common
# ThinkOrSwim gotcha: when a script has an "input", Stock Hacker's Add Study
# Filter dialog surfaces it as an editable field, and it's easy to type 50
# (meaning "50%") instead of 0.5 (the fraction the math expects) - that would
# make the threshold impossible to hit and explain a hard zero.
#
# If this version ALSO returns zero, the bug is in the day1Long math itself,
# not a bad input value - report back either way.
#

def day1Bearish = close[1] < open[1];
def day1Range   = high[1] - low[1];
def day1Body    = open[1] - close[1];
def day1Long    = day1Range > 0 and day1Body >= day1Range * 0.5;

plot scan = day1Bearish and day1Long;
