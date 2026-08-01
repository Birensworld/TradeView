#
# Bullish Reversal Scan - rebuilt from scratch, one criterion at a time.
# Building back up toward the logic in bullish_reversal_study.ts.
#
# STEP 2: day 1 (yesterday, bar 1) is a red/down candle. Same idea as step 1,
# but now testing a single bar-offset reference (close[1]/open[1]) instead of
# the current bar - this confirms historical bar references work correctly in
# the scan engine before we add range-based math on top.
#
# Report back the match count, then we'll add "day 1 is long-bodied" next.
#

def day1Bearish = close[1] < open[1];

plot scan = day1Bearish;
