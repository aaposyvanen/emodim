import sys
import emodim
print("First param:" + sys.argv[1])
analysis = emodim.evaluate_text(sys.argv[1])
print("analysis", analysis)
