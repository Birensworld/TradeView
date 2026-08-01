#
# Bullish Reversal Scan - rebuilt from scratch, one criterion at a time.
# Building back up toward the logic in bullish_reversal_study.ts.
#
# Percent-style inputs below are whole numbers (50 = 50%), not fractions, to
# match how Stock Hacker's Add Study Filter dialog naturally invites you to
# type them - the earlier "zero results" bug across every prior version was
# actually a fraction (0.5) mistakenly entered there as a whole number (50).
#
# STEP 5: adds day2InUpperBand - today's candle BODY (not just its close) must
# sit with its lower edge in the upper day2UpperBandPct of today's own
# high-low range. No size constraint on the body itself, just position.
#
# Report back the match count, then we'll add the 14-day prior-downtrend
# window last (belowDay1Count == 0), since it's the most complex piece.
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

plot scan = day1Bearish and day1Long and day1WithinToday and day2InUpperBand;
