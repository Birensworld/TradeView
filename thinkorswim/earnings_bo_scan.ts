#
# Earnings BO Scan - DEBUG STEP 2d: GetActualEarnings() and GetEstimatedEarnings()
# each work fine alone (47 matches each). Testing them together in the same
# script, still with no arithmetic on their values, to see if the combination
# itself is what breaks compilation, or whether it's specifically the
# beat-percentage math (subtraction/division) added on top.
#

def todayEarnings = HasEarnings();
def actual        = GetActualEarnings();
def estimate      = GetEstimatedEarnings();

plot scan = todayEarnings and !IsNaN(actual) and !IsNaN(estimate);
