#
# Earnings BO Scan - DEBUG STEP 2b: HasEarnings() confirmed working alone (53
# matches), but adding GetActualEarnings()/GetEstimatedEarnings() caused a
# compile error ("At least one plot should be defined"). Testing
# GetActualEarnings() alone here (not GetEstimatedEarnings yet) to isolate
# which of the two functions is actually the problem.
#
# If this ALSO fails to compile, GetActualEarnings() itself is unusable in
# this scan context (matching what happened with fold). If this compiles and
# returns results, the next test will add GetEstimatedEarnings() instead.
#

def todayEarnings = HasEarnings();
def actual        = GetActualEarnings();

plot scan = todayEarnings and !IsNaN(actual);
