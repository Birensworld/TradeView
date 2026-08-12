#
# 3 Bar Momentum Burst Scan - Stock Hacker Study Filter.
#
# Looks at the 3 most recently completed daily bars before today (bar 3 =
# oldest/"1st bar", bar 2 = "2nd bar", bar 1 = most recent/"3rd bar"):
#   Uptrend: the 3rd bar's close is more than minGainPct% (default 2) above
#     the 1st bar's close.
#   At least minPositiveBars (default 2) of the 3 bars must be "positive" -
#     closing higher than the bar before it.
#
# "Value" in the uptrend check is read as closing price, matching the
# "closing price" wording used for the positive-bar check - flag if you meant
# high/low instead.
#
# Pair this Study Filter with these NATIVE Stock Hacker filters (no code needed):
#   Basic Info  > Optionable   = Yes
#   Basic Info  > Exchange     = NYSE
#   Basic Info  > Last Price   > 15
#   Basic Info  > Volume       > 3,000,000
#   Fundamental > Market Cap   > 50,000,000
#

input minGainPct     = 2; # 3rd bar close must exceed 1st bar close by more than this %
input minPositiveBars = 2; # how many of the 3 bars must close higher than the bar before them

def close1 = close[1]; # 3rd bar (most recent of the 3)
def close2 = close[2]; # 2nd bar
def close3 = close[3]; # 1st bar (oldest of the 3)
def close4 = close[4]; # day before the 1st bar, needed to judge if it was itself positive

def uptrend = if close3 > 0 then (close1 - close3) / close3 * 100 > minGainPct else no;

def pos1 = close1 > close2; # 3rd bar positive
def pos2 = close2 > close3; # 2nd bar positive
def pos3 = close3 > close4; # 1st bar positive
def positiveCount = (if pos1 then 1 else 0) + (if pos2 then 1 else 0) + (if pos3 then 1 else 0);
def enoughPositive = positiveCount >= minPositiveBars;

plot scan = uptrend and enoughPositive;
