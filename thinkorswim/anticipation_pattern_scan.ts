#
# Anticipation Pattern Scan - Stock Hacker Study Filter.
#
# Two phases, oldest to newest:
#   Burst (bars 14..5, 10 days): a short bullish run - every day's high is
#     higher than the day before (9 consecutive higher-high days across the
#     10-day span), AND the close moved up at least minBurstPct% (default 15)
#     from the start of the burst (bar 14) to its end (bar 5).
#   Consolidation (bars 4..0, 5 days including today): a tight range - the
#     move from the window's low to its high is at most maxConsolidationPct%
#     (default 1), i.e. price has gone quiet right after the burst.
#
# The higher-highs check is 9 fixed, unrolled comparisons rather than a fold
# loop, since fold was confirmed NOT to work reliably in a Stock Hacker Study
# Filter. To change the burst length you'd need to add/remove comparison
# lines by hand. The consolidation check uses Highest()/Lowest() with an
# input length instead, since those are confirmed working and support a
# variable window size.
#
# Pair this Study Filter with these NATIVE Stock Hacker filters (no code needed):
#   Basic Info  > Optionable   = Yes
#   Basic Info  > Exchange     = NYSE
#   Basic Info  > Last Price   > 15
#   Basic Info  > Volume       > 3,000,000
#   Fundamental > Market Cap   > 50,000,000
#

input minBurstPct         = 15; # required close-to-close increase (%) over the 10-day burst
input consolidationDays   = 5;  # how many of the most recent days (incl. today) must be tight
input maxConsolidationPct = 1;  # consolidation window's high-to-low move must be <= this %

# ---- Burst: 10 days (bars 14..5) of consecutive higher highs ----
def hh1 = high[13] > high[14];
def hh2 = high[12] > high[13];
def hh3 = high[11] > high[12];
def hh4 = high[10] > high[11];
def hh5 = high[9]  > high[10];
def hh6 = high[8]  > high[9];
def hh7 = high[7]  > high[8];
def hh8 = high[6]  > high[7];
def hh9 = high[5]  > high[6];

def allHigherHighs = hh1 and hh2 and hh3 and hh4 and hh5 and hh6 and hh7 and hh8 and hh9;

# ---- Burst: at least minBurstPct% close-to-close gain from bar 14 to bar 5 ----
def burstPct = if close[14] > 0 then (close[5] - close[14]) / close[14] * 100 else Double.NaN;
def bigBurst = burstPct >= minBurstPct;

# ---- Consolidation: last consolidationDays bars (incl. today) stay within maxConsolidationPct% ----
def consolHigh = Highest(high, consolidationDays);
def consolLow  = Lowest(low, consolidationDays);
def consolPct  = if consolLow > 0 then (consolHigh - consolLow) / consolLow * 100 else Double.NaN;
def tightConsolidation = consolPct <= maxConsolidationPct;

plot scan = allHigherHighs and bigBurst and tightConsolidation;
