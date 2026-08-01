#
# Bullish Reversal Scan - rebuilt from scratch, one criterion at a time.
# Building back up toward the logic in bullish_reversal_study.ts.
#
# STEP 3: day 1 is red AND long-bodied (body >= 50% of its own high-low range).
# Adds the first range-based math on top of the confirmed-working bar-offset
# reference from step 2.
#
# Report back the match count, then we'll add "day 1 closes in today's upper
# band" next - the first check that cross-references day 1 against today.
#

input longBodyPct = 0.5; # day-1 body must be >= this fraction of its high-low range

def day1Bearish = close[1] < open[1];
def day1Range   = high[1] - low[1];
def day1Body    = open[1] - close[1];
def day1Long    = day1Range > 0 and day1Body >= day1Range * longBodyPct;

plot scan = day1Bearish and day1Long;
