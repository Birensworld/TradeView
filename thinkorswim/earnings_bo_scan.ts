#
# Earnings BO Scan - DEBUG STEP 2f: hardcoded 25% threshold confirmed working
# (5 matches, no compile error). Swapping back to an `input minBeatPct` in
# place of the hardcoded 25 - this is the last remaining difference from the
# original version that failed to compile, so this isolates whether `input`
# itself is somehow the problem when combined with these earnings functions.
#

input minBeatPct = 25; # actual EPS must beat estimate by at least this %

def todayEarnings = HasEarnings();
def actual        = GetActualEarnings();
def estimate      = GetEstimatedEarnings();
def beatPct       = if estimate != 0 then (actual - estimate) / AbsValue(estimate) * 100 else Double.NaN;

plot scan = todayEarnings and beatPct >= minBeatPct;
