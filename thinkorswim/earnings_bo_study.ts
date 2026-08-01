#
# Earnings BO (Breakout) Study (chart overlay)
# Same logic as earnings_bo_scan.ts, for visually verifying hits on a daily
# chart. Apply via: Studies > Edit Studies > Create, paste this in.
#

input minBeatPct = 25; # actual EPS must beat estimate by at least this %

def todayEarnings = HasEarnings();
def actual        = GetActualEarnings();
def estimate      = GetEstimatedEarnings();
def beatPct       = if estimate != 0 then (actual - estimate) / AbsValue(estimate) * 100 else Double.NaN;
def bigBeat       = beatPct >= minBeatPct;

def signal = todayEarnings and bigBeat;

AddChartBubble(signal, high, "EARN BO " + Round(beatPct, 0) + "%", Color.GREEN, yes);
AssignPriceColor(if signal then Color.GREEN else Color.CURRENT);

Alert(signal, "Earnings breakout: actual EPS beat estimate by 25%+", Alert.BAR, Sound.Ring);
