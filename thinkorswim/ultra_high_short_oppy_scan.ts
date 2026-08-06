#
# Ultra High - Short Oppy Scan - Stock Hacker Study Filter.
#
# Looks for a parabolic weekly run that just topped out, as a short candidate:
#   Weekly gain: over the last weeksBack weekly bars (default 10), the close
#     has gained at least minGainPct% (default 80).
#   Recent peak: the ALL-TIME-HIGH requirement was dropped in favor of a
#     looser "the top is fresh" check - either yesterday was the highest daily
#     high of the last recentDayLookback days (default 5), OR last week was
#     the highest weekly high of the weeksBack window. Interpreted "the day or
#     week before" as: the peak of the move landed on bar 1 (yesterday) at
#     the daily level, or week 1 (last completed week) at the weekly level -
#     flag if that's not what you meant.
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

input weeksBack          = 10; # how many weekly bars back the gain is measured over
input minGainPct         = 80; # required weekly close-to-close gain (%) over that span
input recentDayLookback  = 5;  # daily days checked to confirm yesterday was the recent peak

def wClose = close(period = AggregationPeriod.WEEK);
def weeklyGainPct = if wClose[weeksBack] > 0
                     then (wClose - wClose[weeksBack]) / wClose[weeksBack] * 100
                     else Double.NaN;
def bigWeeklyGain = weeklyGainPct >= minGainPct;

# ---- Recent peak: yesterday was the high of the last few days ----
def dailyRecentHigh    = Highest(high[1], recentDayLookback);
def dayPeakWasYesterday = high[1] >= dailyRecentHigh;

# ---- Recent peak: last week was the high of the weeksBack window ----
def wHigh              = high(period = AggregationPeriod.WEEK);
def weeklyRecentHigh   = Highest(wHigh[1], weeksBack);
def weekPeakWasLastWeek = wHigh[1] >= weeklyRecentHigh;

def recentHighMove = dayPeakWasYesterday or weekPeakWasLastWeek;

plot scan = bigWeeklyGain and recentHighMove;
