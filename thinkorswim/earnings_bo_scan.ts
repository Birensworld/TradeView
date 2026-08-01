#
# Earnings BO Scan - DEBUG STEP 1: isolate HasEarnings() alone.
#
# No beat-percentage math, no week-window logic - just "did this stock report
# earnings today?" On most trading days, dozens to hundreds of NYSE stocks
# report earnings, so this should return a healthy count if HasEarnings()
# works at all in a Stock Hacker Study Filter. If this comes back zero too,
# that confirms the earnings functions themselves don't work here (the same
# way fold didn't), rather than the beat-percentage or week-window math being
# the problem.
#
# Report the match count with just your Price > 5 filter (drop Optionable/
# Exchange/Volume/Market Cap for this test too, to rule out an unrelated
# native-filter mismatch).
#

plot scan = HasEarnings();
