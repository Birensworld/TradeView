#
# Bullish Reversal Scan - rebuilt from scratch, one criterion at a time.
# Building back up toward the logic in bullish_reversal_study.ts.
#
# Percent-style inputs below are whole numbers (50 = 50%), not fractions, to
# match how Stock Hacker's Add Study Filter dialog naturally invites you to
# type them - the earlier "zero results" bug across every prior version was
# actually a fraction (0.5) mistakenly entered there as a whole number (50).
#
# STEP 4: adds day1WithinToday - day 1's close must land in the upper
# day1UpperBandPct of TODAY's high-low range. First check that cross-references
# day 1 against today's range instead of day 1's own range.
#
# Report back the match count, then we'll add day2InUpperBand next.
#

input longBodyPct     = 50; # day-1 body must be >= this % of its own high-low range
input day1UpperBandPct = 50; # day-1 close must fall in the top this-% of today's range

def day1Bearish = close[1] < open[1];
def day1Range   = high[1] - low[1];
def day1Body    = open[1] - close[1];
def day1Long    = day1Range > 0 and day1Body >= day1Range * (longBodyPct / 100);

def day2Range       = high - low;
def day1WithinToday = day2Range > 0
                  and close[1] >= low + day2Range * (1 - day1UpperBandPct / 100)
                  and close[1] <= high;

plot scan = day1Bearish and day1Long and day1WithinToday;
