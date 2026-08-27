#
# Premarket Breakout (First 5 Min) Scan - Stock Hacker Study Filter.
#
# Flags stocks whose price during the FIRST 5 MINUTES of the regular session
# (9:30-9:35 AM ET) traded above that day's pre-market high (4:00-9:30 AM ET).
#
# THIS IS AN INTRADAY SCAN, unlike the daily-bar scans elsewhere in this repo:
#   - Set the scan's aggregation/time frame to 1 minute (not Daily/EOD).
#   - Run it live during or after the 9:30-9:35 window - it won't find
#     anything on EOD daily data, since pre-market and opening-range detail
#     only exist on intraday bars.
#   - Requires extended-hours (pre-market) data to be included in the feed
#     the scan uses, or preMarketHigh below will just be NaN all day.
#
# Pair this Study Filter with these NATIVE Stock Hacker filters (no code needed):
#   Basic Info  > Optionable   = Yes
#   Basic Info  > Exchange     = NYSE
#   Basic Info  > Last Price   > 15
#   Basic Info  > Volume       > 3,000,000
#   Fundamental > Market Cap   > 50,000,000
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

plot scan = brokeOutToday;
