"""Generate outpatient_visits_clean.csv from the raw file.

This is the canonical output of the Part 3 (Prepare) pipeline. Parts 4 and 5
load this file so that every student analyzes the same data regardless of how
their own Part 3 run went.

Every choice this script makes is a policy decision students meet in Part 3:

  dates      The 4 impossible values (Feb 30 2023, not recorded, 13/45/2023,
             2023-00-00) are dropped: 4 rows. Two-part dates are read as
             month-first (MM/DD and MM-DD), the dominant US convention and the
             reading Habiba's Notebook 1 implies. 177 rows are genuinely
             ambiguous under this choice.
  duplicates The 15 exact duplicate rows are dropped before date filtering.
  categories gender, insurance_type, visit_type, follow_up_required mapped to
             canonical values using the maps from Habiba's Notebook 1.
  ranges     age outside 0-120 and negative copay_amount become NaN. The rows
             stay: one bad field is no reason to lose a real visit.
  missing    county stays missing where it is missing. icd_code 'UNKNOWN' and
             missing icd rows stay. Cleaning is not filling.
  derived    visit_month, visit_year, visit_month_name, age_group,
             is_high_utilizer (4+ visits), days_since_last_visit are the Part 3
             transformation outputs, included so Part 4 starts from them.

Run from the repo root:  python3 scripts/make_clean_csv.py
Expected output: 793 rows, 19 columns.
"""

import re

import numpy as np
import pandas as pd

RAW = "site/src/data/outpatient_visits.csv"
OUT = "site/src/data/outpatient_visits_clean.csv"

df = pd.read_csv(RAW)
assert len(df) == 812, f"raw file changed: {len(df)} rows"

# duplicates
df = df.drop_duplicates()

# dates: keep the three expected shapes, then parse. format='mixed' still
# rejects 13/45/2023 and 2023-00-00, so those become NaT and are dropped too.
shape = re.compile(r"^\d{2}/\d{2}/\d{4}$|^\d{4}-\d{2}-\d{2}$|^\d{2}-\d{2}-\d{4}$")
df = df[df["visit_date"].str.match(shape, na=False)].copy()


def parse(v):
    try:
        return pd.to_datetime(v, format="mixed", dayfirst=False)
    except ValueError:
        return pd.NaT


df["visit_date"] = df["visit_date"].apply(parse)
df = df[df["visit_date"].notna()].copy()

# categories (Habiba's Notebook 1 maps)
gender_map = {
    "f": "Female", "F": "Female", "female": "Female", "Female": "Female",
    "FEMALE": "Female",
    "m": "Male", "M": "Male", "male": "Male", "Male": "Male", "MALE": "Male",
    "Non-binary": "Other", "NB": "Other", "other": "Other", "Other": "Other",
}
ins_map = {
    "Medicaid": "Medicaid", "medicaid": "Medicaid", "MEDICAID": "Medicaid",
    "mcd": "Medicaid",
    "Medicare": "Medicare", "medicare": "Medicare", "MEDICARE": "Medicare",
    "MCR": "Medicare",
    "Private": "Private", "private": "Private", "PRIVATE": "Private",
    "Commercial": "Private", "commercial": "Private",
    "Uninsured": "Uninsured", "uninsured": "Uninsured",
    "UNINSURED": "Uninsured", "self-pay": "Uninsured", "Self-Pay": "Uninsured",
}
vt_map = {
    "office visit": "Office Visit", "Office visit": "Office Visit",
    "Office Visit": "Office Visit", "OFFICE VISIT": "Office Visit",
    "telehealth": "Telehealth", "Telehealth": "Telehealth",
    "TELEHEALTH": "Telehealth", "Tele-health": "Telehealth",
    "follow-up": "Follow-Up", "Follow-Up": "Follow-Up",
    "Follow Up": "Follow-Up", "FOLLOW UP": "Follow-Up", "followup": "Follow-Up",
    "urgent care": "Urgent Care", "Urgent Care": "Urgent Care",
    "URGENT CARE": "Urgent Care",
}
df["gender"] = df["gender"].map(gender_map)
df["insurance_type"] = df["insurance_type"].map(ins_map)
df["visit_type"] = df["visit_type"].map(vt_map)
yes, no = {"Y", "Yes", "YES", "yes", "1"}, {"N", "No", "NO", "no", "0"}
df["follow_up_required"] = df["follow_up_required"].apply(
    lambda v: 1 if str(v) in yes else (0 if str(v) in no else np.nan)
)

# out-of-range values
df.loc[(df["age"] < 0) | (df["age"] > 120), "age"] = np.nan
df.loc[df["copay_amount"] < 0, "copay_amount"] = np.nan

# derived columns (Part 3 transformation)
df["visit_month"] = df["visit_date"].dt.month
df["visit_year"] = df["visit_date"].dt.year
df["visit_month_name"] = df["visit_date"].dt.strftime("%b")
df["age_group"] = pd.cut(
    df["age"], bins=[0, 18, 35, 50, 65, 120],
    labels=["0-18", "19-35", "36-50", "51-65", "65+"],
)
visit_counts = df.groupby("patient_id")["visit_id"].transform("count")
df["is_high_utilizer"] = visit_counts >= 4
df = df.sort_values(["patient_id", "visit_date"]).reset_index(drop=True)
df["days_since_last_visit"] = (
    df.groupby("patient_id")["visit_date"].diff().dt.days
)

df["visit_date"] = df["visit_date"].dt.strftime("%Y-%m-%d")

assert len(df) == 793, f"expected 793 rows, got {len(df)}"
assert df.shape[1] == 19, f"expected 19 columns, got {df.shape[1]}"
assert set(df["gender"].dropna()) == {"Female", "Male", "Other"}
assert set(df["insurance_type"].dropna()) == {
    "Medicaid", "Medicare", "Private", "Uninsured"
}
df.to_csv(OUT, index=False)
print(f"wrote {OUT}: {len(df)} rows, {df.shape[1]} columns")
