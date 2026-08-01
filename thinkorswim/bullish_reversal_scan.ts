#
# Potential Morning Star Setup (Stock Hacker) - 2-candle, unconfirmed
#
# Flags the first two candles of a Morning Star before the 3rd/confirmation
# candle exists, so you can watch a name ahead of a possible reversal:
#   Day 1: long bearish candle continuing the downtrend
#   Day 2: body sits high in day 2's range, showing the rejection/indecision
#     that a Morning Star's "star" candle needs
# No 3rd candle is required by design - that candle is what would confirm the
# full Morning Star. Matches any stock where this 2-candle setup occurred on
# ANY of the last scanLookbackDays trading days (default 21, ~1 month), not
# just today - so names that set up recently stay on your radar.
#
# Pair this Study Filter with these NATIVE Stock Hacker filters (no code needed,
# and they run first so the scan is fast):
#   Basic Info  > Optionable   = Yes
#   Basic Info  > Exchange     = NYSE
#   Basic Info  > Last Price   > 15
#   Basic Info  > Volume       > 3,000,000
#   Fundamental > Market Cap   > 50,000,000
#

input windowDays       = 14;  # trading days before day 1 checked for the downtrend
input longBodyPct      = 0.5; # day-1 body must be >= this fraction of its high-low range
input day1UpperBandPct = 0.5; # day-1 close must fall in the top fraction of today's range
input day2UpperBandPct = 0.6; # day-2 (today's) body must reside in the top fraction of today's range
input scanLookbackDays = 21;  # how many trailing trading days (~1 month) count as "recent"

# ---- Day 2 / today (bar 0): body sits in the upper day2UpperBandPct of today's range ----
def day2Range       = high - low;
def day2BodyLow     = Min(open, close);
def day2InUpperBand = day2Range > 0 and day2BodyLow >= low + day2Range * (1 - day2UpperBandPct);

# ---- Day 1 (bar 1, previous day): red, long-bodied, closes in today's upper band ----
# Day 1's close must land in the upper day1UpperBandPct of today's high-low range,
# so there's real separation between the prior day's close and today's low.
def day1Bearish       = close[1] < open[1];
def day1Range         = high[1] - low[1];
def day1Body          = open[1] - close[1];
def day1Long          = day1Range > 0 and day1Body >= day1Range * longBodyPct;
def day1WithinToday   = day2Range > 0
                    and close[1] >= low + day2Range * (1 - day1UpperBandPct)
                    and close[1] <= high;

# ---- Prior downtrend: no day in the 14-day window closed below day 1's close ----
# Window is bars 2..(windowDays+1), the windowDays sessions immediately preceding
# day 1. This confirms day 1 is a genuine new low for the period, not just one red
# day among choppy price action.
def belowDay1Count = fold i = 2 to windowDays + 2
    with cnt = 0
    do cnt + (if GetValue(close, i) < close[1] then 1 else 0);

def priorDowntrend = belowDay1Count == 0;

# ---- Per-bar pattern signal (same shape on every bar, like the chart study) ----
def signal = priorDowntrend
         and day1Bearish and day1Long and day1WithinToday
         and day2InUpperBand;

# ---- Match if the pattern fired on ANY of the last scanLookbackDays bars ----
# (Sum ends at whatever bar Stock Hacker evaluates - normally the most recent
# completed bar for each symbol - so no extra "is this today" guard is needed;
# a prior close[-1]-based NaN check was removed here because Stock Hacker's scan
# engine doesn't reliably return NaN for it the way a live chart does, which was
# silently making every match false.)
plot scan = Sum(signal, scanLookbackDays) > 0;
