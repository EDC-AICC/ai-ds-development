import matplotlib.pyplot as plt
import pandas as pd
import streamlit as st

st.set_page_config(page_title='Clinic Operations Monitor', layout='centered')
st.title('Regional Clinic Wait-Time Tracker')

data = pd.DataFrame({
    'Clinic': ['Clinic A', 'Clinic B', 'Clinic C', 'Clinic D'],
    'Wait_Time': [14, 28, 42, 19],
})

# Interactive controls: dropdown filter and SLA threshold slider
selected_clinics = st.multiselect(
    'Select Clinic(s) to Display:',
    options=data['Clinic'].tolist(),
    default=data['Clinic'].tolist(),
)
sla_target = st.slider(
    'Select Operational SLA Target (Minutes):', min_value=15, max_value=45, value=30
)

# Filter the data to the clinics selected in the dropdown
filtered = data[data['Clinic'].isin(selected_clinics)].copy()
if filtered.empty:
    st.info('Select at least one clinic to display results.')
    st.stop()

# Status flag (recalculated every time the slider moves)
filtered['Status'] = filtered['Wait_Time'].apply(
    lambda x: 'Exceeded' if x > sla_target else 'Compliant'
)

# Display table metrics
st.dataframe(filtered, hide_index=True)

# Visual: neutral gray for compliant clinics, one accent color for exceeded
fig, ax = plt.subplots(figsize=(8, 5))
colors = ['#D9534F' if s == 'Exceeded' else '#6C757D' for s in filtered['Status']]
bars = ax.bar(filtered['Clinic'], filtered['Wait_Time'], color=colors, width=0.6)
ax.axhline(sla_target, color='#D9534F', linestyle='--', linewidth=1.5,
           label=f'Target ({sla_target}m)')

# Direct data labels above each bar
for bar in bars:
    ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 1,
            f'{bar.get_height():.0f}m', ha='center', va='bottom', fontweight='bold')

ax.set_ylabel('Minutes to Consult')
ax.set_ylim(0, max(50, sla_target + 10))
ax.spines[['top', 'right']].set_visible(False)
ax.legend(frameon=False, loc='upper left')
st.pyplot(fig)
