#
# Short Opportunity Scan - Stock Hacker Study Filter.
#
# Looks for a big upside run over the last lookbackBars candles, followed by a
# fading reversal candle today:
#   Upside run: over the lookbackBars sessions before today (bars 1..lookbackBars),
#     the move from the window's low to its high is at least minUpMovePct%.
#   Today (bar 0), the fading candle: small body, long upper wick (rejection of
#     higher prices), and closes lower than it opened (a red/fading close).
#
# lookbackBars is the input to change how many candles the upside move is
# measured over (currently 10). Percent-style inputs are whole numbers
# (30 = 30%), not fractions - see bullish_reversal_scan.ts for why that matters.
#
# This uses Highest()/Lowest(), not a fold loop - those are standard built-in
# functions and, unlike fold, are well-supported in Stock Hacker Study Filters.
# If this still returns nothing, that's the first thing to suspect and we can
# fall back to unrolled comparisons the same way we did for the bullish scan.
#
# Pair this Study Filter with these NATIVE Stock Hacker filters (no code needed,
# and they run first so the scan is fast):
#   Basic Info  > Optionable   = Yes
#   Basic Info  > Exchange     = NYSE
#   Basic Info  > Last Price   > 15
#   Basic Info  > Volume       > 3,000,000
#   Fundamental > Market Cap   > 50,000,000
#

input lookbackBars  = 10; # how many candles before today the upside move is measured over
input minUpMovePct   = 30; # required upside move (%) from the window's low to its high
input smallBodyPct   = 30; # today's body must be <= this % of today's high-low range
input longWickPct    = 50; # today's upper wick must be >= this % of today's high-low range

# ---- Upside run over the lookbackBars sessions before today ----
def upMoveLow  = Lowest(low[1], lookbackBars);
def upMoveHigh = Highest(high[1], lookbackBars);
def upMovePct  = if upMoveLow > 0 then (upMoveHigh - upMoveLow) / upMoveLow * 100 else Double.NaN;
def bigUpMove  = upMovePct >= minUpMovePct;

# ---- Today (bar 0): fading candle - small body, long upper wick, closes lower ----
def todayRange     = high - low;
def todayBody      = AbsValue(close - open);
def todayUpperWick = high - Max(open, close);
def smallBody      = todayRange > 0 and todayBody <= todayRange * (smallBodyPct / 100);
def longUpperWick  = todayRange > 0 and todayUpperWick >= todayRange * (longWickPct / 100);
def closesLower    = close < open;

# ---- Today's high reaches a new all-time high (vs. every prior loaded bar) ----
def allTimeHigh = high >= HighestAll(high[1]);

plot scan = bigUpMove and smallBody and longUpperWick and closesLower and allTimeHigh;
