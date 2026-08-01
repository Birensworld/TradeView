#
# Earnings BO (Breakout) Scan - Stock Hacker Study Filter.
#
# Matches stocks that reported earnings ANY DAY THIS WEEK (Monday through
# today) where actual EPS beat estimates by at least minBeatPct% (default 25).
#
# "This week" is computed from GetDayOfWeek() (1=Monday..7=Sunday), which
# gives how many trading days back today is from Monday (Monday=0, Friday=4).
# Since daily bars only exist for actual trading days, the most recent bar is
# never a Saturday/Sunday - if you run this on a weekend, bar 0 is already
# Friday's bar, so the Monday-through-Friday window this computes IS last
# week's earnings automatically, with no separate weekend case needed.
#
# Built as 5 fixed, unrolled offsets (0..4 = today back through 4 trading days
# ago) rather than a variable-length loop, since fold was confirmed NOT to
# work reliably in a Stock Hacker Study Filter. Each offset only counts if it
# actually falls on/after this week's Monday.
#
# Still depends on HasEarnings()/GetActualEarnings()/GetEstimatedEarnings(),
# which haven't been confirmed working in this scan yet - test the plain
# "today only" logic first if this returns nothing, to isolate whether it's
# the week-window math or the earnings functions themselves.
#
# Pair this Study Filter with these NATIVE Stock Hacker filters (no code needed):
#   Basic Info  > Optionable   = Yes
#   Basic Info  > Exchange     = NYSE
#   Basic Info  > Last Price   > 15
#   Basic Info  > Volume       > 3,000,000
#   Fundamental > Market Cap   > 50,000,000
#

input minBeatPct = 25; # actual EPS must beat estimate by at least this %

def daysBackToMonday = GetDayOfWeek(GetYYYYMMDD()) - 1;

def earn0     = HasEarnings();
def actual0   = GetActualEarnings();
def estimate0 = GetEstimatedEarnings();
def beatPct0  = if estimate0 != 0 then (actual0 - estimate0) / AbsValue(estimate0) * 100 else Double.NaN;
def hit0      = earn0 and beatPct0 >= minBeatPct and 0 <= daysBackToMonday;

def earn1     = HasEarnings()[1];
def actual1   = GetActualEarnings()[1];
def estimate1 = GetEstimatedEarnings()[1];
def beatPct1  = if estimate1 != 0 then (actual1 - estimate1) / AbsValue(estimate1) * 100 else Double.NaN;
def hit1      = earn1 and beatPct1 >= minBeatPct and 1 <= daysBackToMonday;

def earn2     = HasEarnings()[2];
def actual2   = GetActualEarnings()[2];
def estimate2 = GetEstimatedEarnings()[2];
def beatPct2  = if estimate2 != 0 then (actual2 - estimate2) / AbsValue(estimate2) * 100 else Double.NaN;
def hit2      = earn2 and beatPct2 >= minBeatPct and 2 <= daysBackToMonday;

def earn3     = HasEarnings()[3];
def actual3   = GetActualEarnings()[3];
def estimate3 = GetEstimatedEarnings()[3];
def beatPct3  = if estimate3 != 0 then (actual3 - estimate3) / AbsValue(estimate3) * 100 else Double.NaN;
def hit3      = earn3 and beatPct3 >= minBeatPct and 3 <= daysBackToMonday;

def earn4     = HasEarnings()[4];
def actual4   = GetActualEarnings()[4];
def estimate4 = GetEstimatedEarnings()[4];
def beatPct4  = if estimate4 != 0 then (actual4 - estimate4) / AbsValue(estimate4) * 100 else Double.NaN;
def hit4      = earn4 and beatPct4 >= minBeatPct and 4 <= daysBackToMonday;

plot scan = hit0 or hit1 or hit2 or hit3 or hit4;
