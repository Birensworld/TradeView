#
# 3 Bar Momentum Burst Study (chart overlay)
# Same logic as three_bar_momentum_burst_scan.ts, for visually verifying hits
# on a daily chart. Apply via: Studies > Edit Studies > Create, paste this in.
#
# Blue up arrow on the bar where the pattern is confirmed (looking back at the
# 3 most recently completed bars before that point).
#

input minGainPct      = 2; # 3rd bar close must exceed 1st bar close by more than this %
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

# ---- Last bar (today, bar 0) must close higher than the bar before it ----
def lastBarUp = close > close1;

def signal = uptrend and enoughPositive and lastBarUp;

plot Marker = if signal then low - (high - low) * 0.15 else Double.NaN;
Marker.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
Marker.SetDefaultColor(Color.BLUE);
Marker.SetLineWeight(3);

AssignPriceColor(if signal then Color.BLUE else Color.CURRENT);

Alert(signal, "3 Bar Momentum Burst: 2%+ 3-bar uptrend with 2+ positive bars", Alert.BAR, Sound.Ring);
