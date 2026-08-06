#
# Anticipation Pattern Study (chart overlay)
# Same logic as anticipation_pattern_scan.ts, for visually verifying hits on a
# daily chart. Apply via: Studies > Edit Studies > Create, paste this in.
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

def signal = allHigherHighs and bigBurst and tightConsolidation;

AddChartBubble(signal, high, "ANTICIPATION", Color.YELLOW, yes);
AssignPriceColor(if signal then Color.YELLOW else Color.CURRENT);

Alert(signal, "Anticipation pattern: 10-day bullish burst + 5-day tight consolidation", Alert.BAR, Sound.Ring);
