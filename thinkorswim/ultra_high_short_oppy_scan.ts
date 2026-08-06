#
# Ultra High - Short Oppy Scan - Stock Hacker Study Filter.
#
# Looks for a parabolic weekly run followed by a fresh high, as a short
# candidate:
#   Weekly gain: over the last weeksBack weekly bars (default 10), the close
#     has gained at least minGainPct% (default 80).
#   Year high: today's daily high is a new high vs. the trailing
#     yearLookbackDays trading days (default 252, ~1 trading year/52 weeks) -
#     a rolling 1-year high, not a calendar-year-to-date high.
#
# Weekly data is pulled into this daily-aggregation scan via
# close(period = AggregationPeriod.WEEK), the standard thinkScript technique
# for referencing a higher timeframe from a lower-timeframe chart/scan.
#
# Pair this Study Filter with these NATIVE Stock Hacker filters (no code needed):
#   Basic Info  > Optionable   = Yes
#   Basic Info  > Exchange     = NYSE
#   Basic Info  > Last Price   > 15
#   Basic Info  > Volume       > 3,000,000
#   Fundamental > Market Cap   > 50,000,000
#

input weeksBack        = 10;  # how many weekly bars back the gain is measured over
input minGainPct        = 80;  # required weekly close-to-close gain (%) over that span
input yearLookbackDays  = 252; # trading days considered "the year" for the high check

def wClose = close(period = AggregationPeriod.WEEK);
def weeklyGainPct = if wClose[weeksBack] > 0
                     then (wClose - wClose[weeksBack]) / wClose[weeksBack] * 100
                     else Double.NaN;
def bigWeeklyGain = weeklyGainPct >= minGainPct;

def yearHigh = high >= Highest(high[1], yearLookbackDays);

plot scan = bigWeeklyGain and yearHigh;
