#
# Short Opportunity Study (chart overlay)
# Same logic as short_opportunity_scan.ts, for visually verifying hits on a
# daily chart. Apply via: Studies > Edit Studies > Create, paste this in.
#

input lookbackBars = 10;  # how many candles before today the upside move is measured over
input minUpMovePct  = 30;  # required upside move (%) from the window's low to its high
input smallBodyPct  = 30;  # today's body must be <= this % of today's high-low range
input longWickPct   = 50;  # today's upper wick must be >= this % of today's high-low range

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

def signal = bigUpMove and smallBody and longUpperWick and closesLower;

plot Marker = if signal then high + (high - low) * 0.15 else Double.NaN;
Marker.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);
Marker.SetDefaultColor(Color.RED);
Marker.SetLineWeight(3);

AddChartBubble(signal, high, "SHORT", Color.RED, yes);
AssignPriceColor(if signal then Color.RED else Color.CURRENT);

Alert(signal, "Short opportunity: big upside run + fading reversal candle", Alert.BAR, Sound.Ring);
