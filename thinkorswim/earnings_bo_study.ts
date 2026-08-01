#
# Earnings BO (Breakout) Study (chart overlay)
# Same logic as earnings_bo_scan.ts, for visually verifying hits on a daily
# chart. Apply via: Studies > Edit Studies > Create, paste this in.
#

input minBeatPct = 25; # actual EPS must beat estimate by at least this %

def daysBackToMonday = GetDayOfWeek(GetYYYYMMDD()) - 1;

def earn0     = HasEarnings();
def actual0   = GetActualEarnings();
def estimate0 = GetEstimatedEarnings();
def beatPct0  = if estimate0 != 0 then (actual0 - estimate0) / AbsValue(estimate0) * 100 else Double.NaN;
def hit0      = earn0 and beatPct0 >= minBeatPct and 0 <= daysBackToMonday;

def earn1     = HasEarnings()[1];
def actual1   = GetActualEarnings()[1];
def estimate1 = GetEstimatedEarnings()[1];
def beatPct1  = if estimate1 != 0 then (actual1 - estimate1) / AbsValue(estimate1) * 100 else Double.NaN;
def hit1      = earn1 and beatPct1 >= minBeatPct and 1 <= daysBackToMonday;

def earn2     = HasEarnings()[2];
def actual2   = GetActualEarnings()[2];
def estimate2 = GetEstimatedEarnings()[2];
def beatPct2  = if estimate2 != 0 then (actual2 - estimate2) / AbsValue(estimate2) * 100 else Double.NaN;
def hit2      = earn2 and beatPct2 >= minBeatPct and 2 <= daysBackToMonday;

def earn3     = HasEarnings()[3];
def actual3   = GetActualEarnings()[3];
def estimate3 = GetEstimatedEarnings()[3];
def beatPct3  = if estimate3 != 0 then (actual3 - estimate3) / AbsValue(estimate3) * 100 else Double.NaN;
def hit3      = earn3 and beatPct3 >= minBeatPct and 3 <= daysBackToMonday;

def earn4     = HasEarnings()[4];
def actual4   = GetActualEarnings()[4];
def estimate4 = GetEstimatedEarnings()[4];
def beatPct4  = if estimate4 != 0 then (actual4 - estimate4) / AbsValue(estimate4) * 100 else Double.NaN;
def hit4      = earn4 and beatPct4 >= minBeatPct and 4 <= daysBackToMonday;

def signal = hit0 or hit1 or hit2 or hit3 or hit4;

AddChartBubble(signal, high, "EARN BO (this wk)", Color.GREEN, yes);
AssignPriceColor(if signal then Color.GREEN else Color.CURRENT);

Alert(signal, "Earnings breakout this week: actual EPS beat estimate by 25%+", Alert.BAR, Sound.Ring);
