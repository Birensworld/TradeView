#
# Bullish Reversal Scan - rebuilt from scratch, one criterion at a time.
# Building back up toward the logic in bullish_reversal_study.ts.
#
# Percent-style inputs below are whole numbers (50 = 50%), not fractions, to
# match how Stock Hacker's Add Study Filter dialog naturally invites you to
# type them - the earlier "zero results" bug across every prior version was
# actually a fraction (0.5) mistakenly entered there as a whole number (50).
#
# STEP 6 (final piece): adds the 14-day prior-downtrend window - no day in the
# windowDays sessions immediately before day 1 may have closed below day 1's
# close, confirming day 1 is a genuine new low for the period rather than one
# red day among choppy action. This is the most complex construct (a fold
# loop), so it's the last one added and the top suspect if this step breaks.
#
# Report back the match count - once this looks right, this is the full
# pattern matching bullish_reversal_study.ts.
#

input longBodyPct      = 50; # day-1 body must be >= this % of its own high-low range
input day1UpperBandPct = 50; # day-1 close must fall in the top this-% of today's range
input day2UpperBandPct = 60; # day-2 (today's) body must sit in the top this-% of today's range
input windowDays       = 14; # trading days before day 1 checked for the downtrend

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

def belowDay1Count = fold i = 2 to windowDays + 2
    with cnt = 0
    do cnt + (if GetValue(close, i) < close[1] then 1 else 0);

def priorDowntrend = belowDay1Count == 0;

plot scan = day1Bearish and day1Long and day1WithinToday and day2InUpperBand and priorDowntrend;
