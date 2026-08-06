#
# Anticipation Pattern Scan - Stock Hacker Study Filter.
#
# Two phases, oldest to newest:
#   Burst (bars 14..5, 10 days): a short bullish run - close moved up at
#     least minBurstPct% (default 15) from the first bar of the window (bar
#     14) to the 10th/last bar of the window (bar 5). No day-by-day higher-
#     high requirement - real bursts have down days mixed in.
#   Consolidation (bars 4..0, 5 days including today): a tight range - the
#     move from the window's low to its high is at most maxConsolidationPct%
#     (default 1), i.e. price has gone quiet right after the burst.
#
# The consolidation check uses Highest()/Lowest() with an input length, since
# those are confirmed working in Stock Hacker Study Filters and support a
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

# ---- Burst: at least minBurstPct% close-to-close gain from bar 14 to bar 5 ----
def burstPct = if close[14] > 0 then (close[5] - close[14]) / close[14] * 100 else Double.NaN;
def bigBurst = burstPct >= minBurstPct;

# ---- Consolidation: last consolidationDays bars (incl. today) stay within maxConsolidationPct% ----
def consolHigh = Highest(high, consolidationDays);
def consolLow  = Lowest(low, consolidationDays);
def consolPct  = if consolLow > 0 then (consolHigh - consolLow) / consolLow * 100 else Double.NaN;
def tightConsolidation = consolPct <= maxConsolidationPct;

plot scan = bigBurst and tightConsolidation;
