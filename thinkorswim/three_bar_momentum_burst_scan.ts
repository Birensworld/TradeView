#
# 3 Bar Momentum Burst Scan - Stock Hacker Study Filter.
# Rewritten as a "Three White Soldiers" pattern: the last 3 bars (today back
# through 2 days ago) are all green (close > open), and the close gained at
# least minGainPct% (default 3) from the 1st of those 3 to the 3rd (today).
#
# If a streak runs longer than 3 greens in a row, this still only looks at
# the LAST 3 - Stock Hacker always evaluates "today" as the endpoint, so a
# 4th or 5th consecutive green day just shifts which 3 bars are "the pattern"
# without any extra logic needed.
#
# Pair this Study Filter with these NATIVE Stock Hacker filters (no code needed):
#   Basic Info  > Optionable   = Yes
#   Basic Info  > Exchange     = NYSE
#   Basic Info  > Last Price   > 15
#   Basic Info  > Volume       > 3,000,000
#   Fundamental > Market Cap   > 50,000,000
#

input minGainPct = 3; # required % gain from the 1st soldier's close to the 3rd (today)

def isGreen = close > open;
def last3Green = isGreen and isGreen[1] and isGreen[2];

def gainPct = if close[2] > 0 then (close - close[2]) / close[2] * 100 else Double.NaN;
def bigGain = gainPct >= minGainPct;

plot scan = last3Green and bigGain;
