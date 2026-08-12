#
# High Volume Gainer Study (chart overlay)
# Green up arrow when today's volume is above 9 million AND the stock has
# risen more than 1% (close vs. yesterday's close).
# Apply via: Studies > Edit Studies > Create, paste this in, add to chart.
#

input minVolume = 9000000; # today's volume must be above this
input minPctGain = 1;      # today's % gain (close vs. prior close) must exceed this

def volOK = volume > minVolume;

def pctChange = (close - close[1]) / close[1] * 100;
def gainOK = pctChange > minPctGain;

def signal = volOK and gainOK;

plot Marker = if signal then low - (high - low) * 0.15 else Double.NaN;
Marker.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
Marker.SetDefaultColor(Color.GREEN);
Marker.SetLineWeight(3);

Alert(signal, "High volume gainer: volume > 9M and up more than 1%", Alert.BAR, Sound.Ring);
