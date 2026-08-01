#
# Bullish Reversal Scan - rebuilt from scratch, one criterion at a time.
# Building back up toward the logic in bullish_reversal_study.ts.
#
# Percent-style inputs below are whole numbers (50 = 50%), not fractions, to
# match how Stock Hacker's Add Study Filter dialog naturally invites you to
# type them - the earlier "zero results" bug across every prior version was
# actually a fraction (0.5) mistakenly entered there as a whole number (50).
#
# STEP 6 RETEST (no fold): same 3-day prior-downtrend window as just tested,
# but using explicit unrolled comparisons instead of a fold loop. The fold
# construct is the prime suspect for the hard zero at windowDays=3 + price>5 -
# this rules it out (or confirms it) as the actual bug. If this version
# returns real matches, we'll scale the window back up to 14 by adding more
# explicit lines rather than reintroducing fold.
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

def belowDay1Count =
    (if close[2] < close[1] then 1 else 0) +
    (if close[3] < close[1] then 1 else 0) +
    (if close[4] < close[1] then 1 else 0);

def priorDowntrend = belowDay1Count == 0;

plot scan = day1Bearish and day1Long and day1WithinToday and day2InUpperBand and priorDowntrend;
