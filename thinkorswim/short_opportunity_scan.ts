#
# Short Opportunity Scan - Stock Hacker Study Filter.
#
# DEBUG STEP 1: testing bigUpMove in isolation - is the "parabolic move upward"
# check itself finding anything? Report back the match count (with your usual
# native filters - Optionable/NYSE/Price/Volume/Market Cap), then we'll add the
# fading-candle and all-time-high checks back one at a time, the same way we
# debugged the bullish reversal scan.
#
# Full pattern (for reference, once this is confirmed working):
#   Upside run: over the lookbackBars sessions before today (bars 1..lookbackBars),
#     the move from the window's low to its high is at least minUpMovePct%.
#   Today (bar 0), the fading candle: small body, long upper wick, closes lower.
#   Today's high is a new all-time high vs. every prior loaded bar.
#

input lookbackBars = 10; # how many candles before today the upside move is measured over
input minUpMovePct  = 30; # required upside move (%) from the window's low to its high

# ---- Upside run over the lookbackBars sessions before today ----
def upMoveLow  = Lowest(low[1], lookbackBars);
def upMoveHigh = Highest(high[1], lookbackBars);
def upMovePct  = if upMoveLow > 0 then (upMoveHigh - upMoveLow) / upMoveLow * 100 else Double.NaN;
def bigUpMove  = upMovePct >= minUpMovePct;

plot scan = bigUpMove;
