#
# Earnings BO Scan - DEBUG STEP 2: HasEarnings() confirmed working alone (53
# matches). Now adding the beat-percentage check for TODAY only (no week
# window yet), to isolate whether GetActualEarnings()/GetEstimatedEarnings()
# work correctly in this scan.
#
# Report the match count - should be some fraction of the 53 from step 1, not
# necessarily zero, but zero here would point squarely at the beat-percentage
# math (or the actual/estimate functions themselves) as the real bug.
#

input minBeatPct = 25; # actual EPS must beat estimate by at least this %

def todayEarnings = HasEarnings();
def actual        = GetActualEarnings();
def estimate      = GetEstimatedEarnings();
def beatPct       = if estimate != 0 then (actual - estimate) / AbsValue(estimate) * 100 else Double.NaN;
def bigBeat       = beatPct >= minBeatPct;

plot scan = todayEarnings and bigBeat;
