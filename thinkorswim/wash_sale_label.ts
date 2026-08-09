#
# Wash Sale Label (chart overlay)
# Shows the last close date and the date 30 calendar days after it - useful as
# a quick reference for the IRS wash sale rule (selling at a loss and
# repurchasing a "substantially identical" security within 30 days before or
# after the sale disallows the loss). This only computes 30 days FORWARD from
# the last close date on the chart; it doesn't know your actual trade dates.
#
# ThinkScript has no built-in function to add calendar days to a date, so this
# rolls the month/year over manually (DaysInMonth script block below), rather
# than relying on any undocumented date-arithmetic behavior.
#
# Apply via: Studies > Edit Studies > Create, paste this in, add to chart.
#

script DaysInMonth {
    input yr = 0;
    input mo = 0;
    def isLeap = (yr % 4 == 0 and yr % 100 != 0) or (yr % 400 == 0);
    plot Result = if mo == 1 then 31
             else if mo == 2 then (if isLeap then 29 else 28)
             else if mo == 3 then 31
             else if mo == 4 then 30
             else if mo == 5 then 31
             else if mo == 6 then 30
             else if mo == 7 then 31
             else if mo == 8 then 31
             else if mo == 9 then 30
             else if mo == 10 then 31
             else if mo == 11 then 30
             else 31;
}

input daysToAdd = 30;

# "Last transaction close" = the most recently COMPLETED trading session's
# close, not today's still-forming bar while the market is open. If we're on
# the last/current bar and it's before 4:00pm ET (regular session still
# running), fall back to yesterday's date; otherwise (after the close, or
# looking at a historical bar) use the current bar's date directly.
def isLastBar    = IsNaN(close[-1]);
def afterClose   = SecondsFromTime(1600) >= 0;
def d = if isLastBar and !afterClose then GetYYYYMMDD()[1] else GetYYYYMMDD();

def yr0 = Floor(d / 10000);
def mo0 = Floor((d - yr0 * 10000) / 100);
def dy0 = d - yr0 * 10000 - mo0 * 100;

def daysInMonth0 = DaysInMonth(yr0, mo0);
def dySum        = dy0 + daysToAdd;

# ---- First month rollover ----
def rollover1 = dySum > daysInMonth0;
def dy1 = if rollover1 then dySum - daysInMonth0 else dySum;
def mo1 = if rollover1 then (if mo0 == 12 then 1 else mo0 + 1) else mo0;
def yr1 = if rollover1 and mo0 == 12 then yr0 + 1 else yr0;

def daysInMonth1 = DaysInMonth(yr1, mo1);

# ---- Second month rollover (needed for e.g. Jan 31 + 30 days) ----
def rollover2 = dy1 > daysInMonth1;
def dy2 = if rollover2 then dy1 - daysInMonth1 else dy1;
def mo2 = if rollover2 then (if mo1 == 12 then 1 else mo1 + 1) else mo1;
def yr2 = if rollover2 and mo1 == 12 then yr1 + 1 else yr1;

def moStr0 = if mo0 < 10 then "0" + mo0 else "" + mo0;
def dyStr0 = if dy0 < 10 then "0" + dy0 else "" + dy0;
def moStr2 = if mo2 < 10 then "0" + mo2 else "" + mo2;
def dyStr2 = if dy2 < 10 then "0" + dy2 else "" + dy2;

AddLabel(yes, "Last Close: " + moStr0 + "/" + dyStr0 + "/" + yr0, Color.WHITE);
AddLabel(yes, "Wash Sale Window Ends: " + moStr2 + "/" + dyStr2 + "/" + yr2, Color.YELLOW);
