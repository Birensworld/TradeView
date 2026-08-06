#
# Anticipation Pattern Study (chart overlay)
# Same logic as anticipation_pattern_scan.ts, for visually verifying hits on a
# daily chart. Apply via: Studies > Edit Studies > Create, paste this in.
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

def signal = bigBurst and tightConsolidation;

AddChartBubble(signal, high, "ANTICIPATION", Color.YELLOW, yes);
AssignPriceColor(if signal then Color.YELLOW else Color.CURRENT);

Alert(signal, "Anticipation pattern: 10-day bullish burst + 5-day tight consolidation", Alert.BAR, Sound.Ring);
