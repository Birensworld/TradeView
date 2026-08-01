#
# Earnings BO Scan - DEBUG STEP 2c: GetActualEarnings() confirmed working (47
# matches, close to the 53 from HasEarnings() alone). Now testing
# GetEstimatedEarnings() alone to see if THAT is the function causing the
# earlier compile failure.
#

def todayEarnings = HasEarnings();
def estimate      = GetEstimatedEarnings();

plot scan = todayEarnings and !IsNaN(estimate);
