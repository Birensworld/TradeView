#
# Bullish Reversal Study (chart overlay)
# Same logic as bullish_reversal_scan.ts, for visually verifying hits on a daily
# chart. Apply via: Studies > Edit Studies > Create, paste this in, add to chart.
#

input minLowerLows    = 3;     # how many of the last 5 days must post a lower low
input maxBodyPct      = 0.3;   # body <= this fraction of today's high-low range
input minLowerWickPct = 0.5;   # lower wick >= this fraction of today's range
input maxUpperWickPct = 0.25;  # upper wick <= this fraction of today's range

# ---- Downtrend check: lower lows across the 5 trading days before today ----
def lowerLowCount =
    (if low[1] < low[2] then 1 else 0) +
    (if low[2] < low[3] then 1 else 0) +
    (if low[3] < low[4] then 1 else 0) +
    (if low[4] < low[5] then 1 else 0) +
    (if low[5] < low[6] then 1 else 0);

def downtrend = lowerLowCount >= minLowerLows;

# ---- Today's hammer-style upside reversal ----
def o = open;
def c = close;
def h = high;
def l = low;
def range = h - l;
def body = AbsValue(c - o);
def lowerWick = Min(o, c) - l;
def upperWick = h - Max(o, c);
def closedUpperHalf = c >= l + range * 0.5;

def hammer = range > 0
         and body <= range * maxBodyPct
         and lowerWick >= range * minLowerWickPct
         and upperWick <= range * maxUpperWickPct
         and closedUpperHalf;

def signal = downtrend and hammer;

plot Marker = if signal then low - (high - low) * 0.15 else Double.NaN;
Marker.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
Marker.SetDefaultColor(Color.CYAN);
Marker.SetLineWeight(3);

AddChartBubble(signal, low, "REVERSAL", Color.CYAN, no);
AssignPriceColor(if signal then Color.CYAN else Color.CURRENT);

Alert(signal, "Bullish reversal: prior downtrend + hammer candle", Alert.BAR, Sound.Ring);
