#
# Earnings BO (Breakout) Scan - Stock Hacker Study Filter.
#
# Matches stocks that reported earnings TODAY where actual EPS beat estimates
# by at least minBeatPct% (default 25).
#
# Uses HasEarnings()/GetActualEarnings()/GetEstimatedEarnings() - these are
# real thinkScript fundamental-event functions, but untested by us in a Stock
# Hacker Study Filter specifically. Given our track record (fold broke scans,
# Highest/Lowest/HighestAll worked fine), test this in isolation first and
# report the match count before combining it with any breakout price/volume
# criteria.
#
# Pair this Study Filter with these NATIVE Stock Hacker filters (no code needed):
#   Basic Info  > Optionable   = Yes
#   Basic Info  > Exchange     = NYSE
#   Basic Info  > Last Price   > 15
#   Basic Info  > Volume       > 3,000,000
#   Fundamental > Market Cap   > 50,000,000
#

input minBeatPct = 25; # actual EPS must beat estimate by at least this %

def todayEarnings = HasEarnings();
def actual        = GetActualEarnings();
def estimate      = GetEstimatedEarnings();
def beatPct       = if estimate != 0 then (actual - estimate) / AbsValue(estimate) * 100 else Double.NaN;
def bigBeat       = beatPct >= minBeatPct;

plot scan = todayEarnings and bigBeat;
