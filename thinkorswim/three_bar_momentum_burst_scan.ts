#
# 3 Bar Momentum Burst Scan - Stock Hacker Study Filter.
#
# Looks at the 3 most recently completed daily bars before today (bar 3 =
# oldest/"1st bar", bar 2 = "2nd bar", bar 1 = most recent/"3rd bar"):
#   Uptrend: the 3rd bar's close is more than minGainPct% (default 3) above
#     the 1st bar's close.
#   At least minPositiveBars (default 2) of the 2 available day-over-day
#     transitions within those 3 bars must be positive (bar1 > bar2 and/or
#     bar2 > bar3). Only 3 bars are referenced total - no 4th/prior bar - so
#     whether bar 3 (the oldest) was itself an up day isn't checked.
#   Today (bar 0) must also close higher than bar 1 (the most recent of the 3).
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

input minGainPct      = 3; # 3rd bar close must exceed 1st bar close by more than this %
input minPositiveBars = 2; # how many of the 2 bar-to-bar transitions must be positive

def close1 = close[1]; # 3rd bar (most recent of the 3)
def close2 = close[2]; # 2nd bar
def close3 = close[3]; # 1st bar (oldest of the 3)

def uptrend = if close3 > 0 then (close1 - close3) / close3 * 100 > minGainPct else no;

def pos1 = close1 > close2; # bar1 higher than bar2
def pos2 = close2 > close3; # bar2 higher than bar3
def positiveCount = (if pos1 then 1 else 0) + (if pos2 then 1 else 0);
def enoughPositive = positiveCount >= minPositiveBars;

# ---- Last bar (today, bar 0) must close higher than the bar before it ----
def lastBarUp = close > close1;

plot scan = uptrend and enoughPositive and lastBarUp;
