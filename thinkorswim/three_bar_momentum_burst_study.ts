#
# 3 Bar Momentum Burst Study (chart overlay) - "Three White Soldiers" pattern.
# Same logic as three_bar_momentum_burst_scan.ts, plotted wherever it occurs
# historically on the chart (not just today). Apply via: Studies > Edit
# Studies > Create, paste this in.
#
# The pattern is: the last 3 bars are all green (close > open), gaining at
# least minGainPct% (default 3) from the 1st of those 3 to the 3rd. If a
# streak runs 4 or 5 greens in a row, the arrow only appears on the LAST
# green day of that streak (the 3rd soldier), not on every qualifying day
# within it - streakEnd below enforces that by requiring the next bar to NOT
# be green (or there being no next bar yet, i.e. today).
#

input minGainPct = 3; # required % gain from the 1st soldier's close to the 3rd

def isGreen = close > open;
def last3Green = isGreen and isGreen[1] and isGreen[2];

def gainPct = if close[2] > 0 then (close - close[2]) / close[2] * 100 else Double.NaN;
def bigGain = gainPct >= minGainPct;

# ---- Only fire on the final green day of a streak, not every day within it ----
def isLastBar          = IsNaN(close[-1]);
def nextBarBreaksStreak = isLastBar or close[-1] <= open[-1];

def signal = last3Green and bigGain and nextBarBreaksStreak;

plot Marker = if signal then low - (high - low) * 0.15 else Double.NaN;
Marker.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
Marker.SetDefaultColor(Color.GREEN);
Marker.SetLineWeight(3);

# ---- Green price color only on the last/current bar, not every past match ----
AssignPriceColor(if signal and isLastBar then Color.GREEN else Color.CURRENT);
