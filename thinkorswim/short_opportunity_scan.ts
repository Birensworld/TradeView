#
# Short Opportunity Scan - Stock Hacker Study Filter.
#
# DEBUG STEP 3: adds a %-move requirement over the same 15-bar window used for
# the SMA-rising check:
#   1. Uptrend: the 50-day SMA today is higher than the 50-day SMA
#      risingLookback bars ago (default 15) - the average has been rising.
#   2. Today's high is a new high for the trailing yearLookback bars
#      (default 252, ~1 trading year) - a 1-year/52-week high.
#   3. Over the same risingLookback bars (1..15), the move from the window's
#      low to its high is at least minMovePct% (default 30).
#
# Report the match count with your usual native filters.
#

input smaLength      = 50;  # SMA length used for the uptrend check
input risingLookback = 15;  # bars back the SMA is compared against, and the move window
input yearLookback   = 252; # trading days considered "the year" for the high check
input minMovePct     = 30;  # required move (%) from the window's low to its high

def sma50     = SimpleMovingAvg(close, smaLength);
def smaRising = sma50 > sma50[risingLookback];

def yearHigh = high >= Highest(high[1], yearLookback);

def moveLow  = Lowest(low[1], risingLookback);
def moveHigh = Highest(high[1], risingLookback);
def movePct  = if moveLow > 0 then (moveHigh - moveLow) / moveLow * 100 else Double.NaN;
def bigMove  = movePct >= minMovePct;

plot scan = smaRising and yearHigh and bigMove;
