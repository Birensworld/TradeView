#
# Premarket Breakout (First 5 Min) Study (chart overlay)
# Same logic as premarket_breakout_scan.ts. Apply to a 1-MINUTE chart with
# extended (pre-market) hours shown - Studies > Edit Studies > Create, paste
# this in, add to chart. Won't show anything meaningful on a Daily chart.
#

def newDay = GetDay() != GetDay()[1];

# ---- Pre-market high: running max of `high` from 4:00am to 9:30am ET ----
def inPreMarket = SecondsFromTime(0400) >= 0 and SecondsTillTime(0930) > 0;
def preMarketHigh =
    if newDay then (if inPreMarket then high else Double.NaN)
    else if inPreMarket then Max(high, preMarketHigh[1])
    else preMarketHigh[1];

# ---- First 5 minutes of the regular session: 9:30:00 - 9:34:59 ET ----
def inOpeningRange = SecondsFromTime(0930) >= 0 and SecondsFromTime(0930) < 300;

def brokeOutNow = inOpeningRange and high > preMarketHigh;

# ---- Carry "yes, it broke out" forward for the rest of the day once true ----
def brokeOutToday =
    if newDay then brokeOutNow
    else if inOpeningRange then (brokeOutToday[1] or brokeOutNow)
    else brokeOutToday[1];

# ---- Mark only the first minute bar where the breakout happens ----
def firstBreakout = brokeOutNow and (newDay or !brokeOutToday[1]);

plot PreMarketHighLine = preMarketHigh;
PreMarketHighLine.SetDefaultColor(Color.GRAY);
PreMarketHighLine.SetStyle(Curve.SHORT_DASH);

plot Marker = if firstBreakout then low - (high - low) * 0.15 else Double.NaN;
Marker.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
Marker.SetDefaultColor(Color.GREEN);
Marker.SetLineWeight(3);

AddChartBubble(firstBreakout, low, "PM BREAKOUT", Color.GREEN, no);
