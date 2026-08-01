#
# Bullish Reversal Scan - rebuilt from scratch, one criterion at a time.
#
# STEP 0 (sanity check): matches every symbol that passes your native Stock
# Hacker filters (Optionable=Yes, Exchange=NYSE, Last Price>15, Volume>3,000,000,
# Market Cap>50,000,000), with NO pattern logic at all.
#
# Save this as your Study Filter and run it. If this returns a healthy list of
# names (should be at least dozens, likely hundreds), the Study Filter mechanism
# itself is working and the problem has been in the pattern logic all along -
# tell me the result count and we'll add the next criterion.
#
# If this ALSO returns zero or very few results, the issue is upstream of the
# script entirely - check:
#   - The filter condition is set to "scan is true" / "scan = 1" (not "= 0")
#   - The 5 native filters aren't combined with an unintended AND that excludes
#     everything (e.g. Exchange dropdown accidentally set to something else)
#   - This saved study is the one actually selected in Add Study Filter
#

plot scan = 1;
