#
# Ultra High - Short Oppy Study (chart overlay)
# Same logic as ultra_high_short_oppy_scan.ts, for visually verifying hits on
# a daily chart. Apply via: Studies > Edit Studies > Create, paste this in.
#

input weeksBack         = 10; # how many weekly bars back the gain is measured over
input minGainPct        = 80; # required weekly close-to-close gain (%) over that span
input recentDayLookback = 5;  # daily days checked to confirm yesterday was the recent peak

def wClose = close(period = AggregationPeriod.WEEK);
def weeklyGainPct = if wClose[weeksBack] > 0
                     then (wClose - wClose[weeksBack]) / wClose[weeksBack] * 100
                     else Double.NaN;
def bigWeeklyGain = weeklyGainPct >= minGainPct;

# ---- Recent peak: yesterday was the high of the last few days ----
def dailyRecentHigh    = Highest(high[1], recentDayLookback);
def dayPeakWasYesterday = high[1] >= dailyRecentHigh;

# ---- Recent peak: last week was the high of the weeksBack window ----
def wHigh              = high(period = AggregationPeriod.WEEK);
def weeklyRecentHigh   = Highest(wHigh[1], weeksBack);
def weekPeakWasLastWeek = wHigh[1] >= weeklyRecentHigh;

def recentHighMove = dayPeakWasYesterday or weekPeakWasLastWeek;

def signal = bigWeeklyGain and recentHighMove;

plot Marker = if signal then high + (high - low) * 0.15 else Double.NaN;
Marker.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);
Marker.SetDefaultColor(Color.RED);
Marker.SetLineWeight(3);

AddChartBubble(signal, high, "ULTRA HIGH SHORT", Color.RED, yes);
AssignPriceColor(if signal then Color.RED else Color.CURRENT);

Alert(signal, "Ultra High Short Oppy: 80%+ weekly gain over 10 weeks + recent peak", Alert.BAR, Sound.Ring);
