#AddLabel(yes, GetUnderlyingSymbol(), Color.WHITE);
#def allows you to teach ThinkScript new "words" that you can reference later in your code
#GetYYYYMMDD() returns today's date
#there are 252 trading days each year
# One-Year Percent Gain (approx 252 trading days)
# Works as: Study + Scan + Watchlist Column (Custom Quote)

# Percent From 50-Day Simple Moving Average
# Positive = price above SMA
# Negative = price below SMA

declare lower;

input tradingDaysInYear = 252;
input price = close;

# Current and 1-year-ago price (approx)
def pNow  = price;
def pThen = price[tradingDaysInYear];

# Guard against missing history / divide by zero
def hasData = !IsNaN(pThen) and pThen != 0;

def oneYearPctGain = if hasData then 100 * (pNow / pThen - 1) else Double.NaN;

#Plot at bottom of the chart
#plot OneYearGainPct = oneYearPctGain;
#OneYearGainPct.SetDefaultColor(GetColor(1));
#OneYearGainPct.SetLineWeight(2);

AddLabel(
    hasData,
    "1Y Gain: " + Round(oneYearPctGain, 2) + "%",
    if oneYearPctGain >= 0 then Color.GREEN else Color.RED
);

# Optional: show the reference prices
# AddLabel(hasData, "Now: " + AsDollars(pNow) + " | 1Y Ago: " + AsDollars(pThen), Color.GRAY);

# Code for YTD Gains
#================================================================================================

def yearstart = GetYear() * 10000 + 101;
def tradedays = CountTradingDays(yearstart, GetYYYYMMDD());
def closeEOY = GetValue(close, tradedays, 252);
def YTDnetchange = ((close - closeEOY) / closeEOY) * 100;
def isDaily = GetAggregationPeriod() == AggregationPeriod.DAY;

#YTDnetchange could have been the plot line, however to view results with a limited number of decimal places that line was another def or definition for ThinkScript.  And a new "word" value was used for the plot line in this code.  2 means round to 2 decimal places

def value = Round(YTDnetchange, 2);

AddLabel(
    isDaily,
    "YTD change: " + value + "%",
    Color.GRAY
);

# Code for Volume
#================================================================================================

def volM = volume / 1000000;

AddLabel(yes, "Volume: " + Round(volM, 2) + "M", Color.GRAY);
