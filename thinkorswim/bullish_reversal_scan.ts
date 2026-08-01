#
# Bullish Reversal Scan - rebuilt from scratch, one criterion at a time.
#
# STEP 1: today (the scan day) is a red/down candle. This is the simplest
# possible real condition - roughly half of all stocks on any given day should
# match, so this is a good next sanity check before adding anything shape- or
# trend-based.
#
# Report back the match count, then we'll add the next criterion (day 1 being
# a long red candle) on top of this.
#

def day2Bearish = close < open;

plot scan = day2Bearish;
