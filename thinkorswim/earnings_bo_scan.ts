#
# Earnings BO Scan - DEBUG STEP 2e: both earnings functions confirmed working
# together (42 matches, no compile error). Now adding back the beat-percentage
# arithmetic itself (subtraction, division, threshold), hardcoded to 25% (no
# input yet), to isolate whether the arithmetic or the input is what breaks.
#

def todayEarnings = HasEarnings();
def actual        = GetActualEarnings();
def estimate      = GetEstimatedEarnings();
def beatPct       = if estimate != 0 then (actual - estimate) / AbsValue(estimate) * 100 else Double.NaN;

plot scan = todayEarnings and beatPct >= 25;
