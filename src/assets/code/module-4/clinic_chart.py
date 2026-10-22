import matplotlib.pyplot as plt
import pandas as pd

# Clinic wait time summary data
data = {
    'clinic': ['Clinic A', 'Clinic B', 'Clinic C', 'Clinic D'],
    'wait_time': [14, 28, 42, 19],
}
df = pd.DataFrame(data)

# Target threshold
threshold = 30
colors = ['#D9534F' if w > threshold else '#6C757D' for w in df['wait_time']]

# Build visualization
fig, ax = plt.subplots(figsize=(8, 5))
bars = ax.bar(df['clinic'], df['wait_time'], color=colors, width=0.6)

# Add reference threshold line
ax.axhline(
    threshold,
    color='#D9534F',
    linestyle='--',
    linewidth=1.5,
    label=f'Target Threshold ({threshold}m)',
)

# Annotate values above bars
for bar in bars:
    yval = bar.get_height()
    ax.text(
        bar.get_x() + bar.get_width() / 2.0,
        yval + 1,
        f'{yval}m',
        ha='center',
        va='bottom',
        fontweight='bold',
    )

# Title (figure level) and evidence-based subtitle (axes level)
fig.suptitle(
    'Median Patient Wait Times by Facility',
    fontsize=14,
    fontweight='bold',
    x=0.02,
    ha='left',
)
ax.set_title(
    'Clinic C exceeded the network service-level target of 30 minutes in Q3',
    fontsize=10,
    color='#495057',
    loc='left',
)
ax.set_ylabel('Minutes to Consult')
ax.set_ylim(0, 50)
ax.spines[['top', 'right']].set_visible(False)
ax.legend(frameon=False, loc='upper left')
plt.tight_layout()
plt.show()
